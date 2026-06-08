import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock login for demo if firebase isn't configured
  const mockLogin = (email) => {
    const mockUser = { email, uid: 'mock-uid-123' };
    setCurrentUser(mockUser);
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
  };

  const signup = async (email, password) => {
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.warn("Firebase signup failed (missing config). Using mock signup.");
      mockLogin(email);
    }
  };

  const login = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.warn("Firebase login failed (missing config). Using mock login.");
      mockLogin(email);
    }
  };

  const logout = () => {
    try {
      signOut(auth);
    } catch (error) {
      console.warn("Firebase signout failed. Removing mock user.");
    }
    setCurrentUser(null);
    localStorage.removeItem('mockUser');
  };

  useEffect(() => {
    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrentUser(user);
        } else {
          // Check for mock user
          const mock = localStorage.getItem('mockUser');
          if (mock) {
            setCurrentUser(JSON.parse(mock));
          } else {
            setCurrentUser(null);
          }
        }
        setLoading(false);
      });
    } catch (e) {
      console.warn("Firebase not initialized properly. Falling back to local state.");
      const mock = localStorage.getItem('mockUser');
      if (mock) setCurrentUser(JSON.parse(mock));
      setLoading(false);
    }

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
