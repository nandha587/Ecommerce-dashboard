import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ProductContext = createContext();

export function useProducts() {
  return useContext(ProductContext);
}

const mockProducts = [
  { id: '1', name: 'Premium Wireless Headphones', price: 299.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800', description: 'High-fidelity audio with active noise cancellation.' },
  { id: '2', name: 'Mechanical Keyboard', price: 149.99, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800', description: 'RGB mechanical keyboard with tactile switches.' },
  { id: '3', name: 'Ultra-wide Monitor', price: 799.00, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800', description: '34-inch curved display for immersive productivity.' },
  { id: '4', name: 'Smart Watch', price: 199.50, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800', description: 'Fitness tracking, notifications, and heart rate monitor.' },
];

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const productsRef = collection(db, 'products');
      unsubscribe = onSnapshot(productsRef, (snapshot) => {
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // If DB has items, use them. Otherwise show mock items
        if (productsData.length > 0) {
          setProducts(productsData);
        } else {
          setProducts(mockProducts);
        }
        setLoading(false);
      }, (err) => {
        console.warn("Firebase snapshot failed. Using mock data.", err);
        setProducts(mockProducts);
        setLoading(false);
      });
    } catch (err) {
      console.warn("Firebase collection reference failed. Using mock data.");
      setProducts(mockProducts);
      setLoading(false);
    }
    return unsubscribe;
  }, []);

  const addProduct = async (product) => {
    try {
      await addDoc(collection(db, 'products'), product);
    } catch (err) {
      console.warn("Firebase add failed. Updating mock state.");
      setProducts(prev => [...prev, { ...product, id: Date.now().toString() }]);
    }
  };

  const removeProduct = async (id) => {
    try {
      // Don't try to delete mock items from Firebase
      if (mockProducts.find(p => p.id === id)) {
        setProducts(prev => prev.filter(p => p.id !== id));
        return;
      }
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      console.warn("Firebase delete failed.");
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const value = {
    products,
    loading,
    addProduct,
    removeProduct
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}
