import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Package, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 100, padding: '1rem 0' }}>
      <div className="container flex justify-between items-center">
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
          Nexus<span style={{ color: 'var(--accent-primary)' }}>Store</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link to="/" className="btn btn-outline" style={{ border: 'none' }}>Home</Link>
          
          <Link to="/checkout" className="btn btn-outline" style={{ position: 'relative' }}>
            <ShoppingCart size={20} />
            Cart
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: 'var(--accent-primary)',
                color: 'white',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {currentUser ? (
            <>
              <Link to="/dashboard" className="btn btn-outline">
                <Package size={20} />
                Products
              </Link>
              <button onClick={handleLogout} className="btn btn-primary">
                <LogOut size={20} />
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">
              <LogIn size={20} />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
