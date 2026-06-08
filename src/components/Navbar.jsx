import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, LogOut, LogIn, Heart, Search, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 100, padding: '1rem 0' }}>
      <div className="container flex justify-between items-center">
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
          Nexus<span style={{ color: 'var(--accent-primary)' }}>Store</span>
        </Link>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', flex: 1, maxWidth: '400px', margin: '0 2rem' }}>
          <input 
            type="text" 
            placeholder="Search products..." 
            className="form-input"
            style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, padding: '0.75rem' }}>
            <Search size={20} />
          </button>
        </form>

        <div className="flex items-center gap-4">
          <Link to="/wishlist" className="btn btn-outline" style={{ position: 'relative' }}>
            <Heart size={20} color={wishlistItems.length > 0 ? '#ef4444' : 'currentColor'} fill={wishlistItems.length > 0 ? '#ef4444' : 'none'} />
            {wishlistItems.length > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold' }}>
                {wishlistItems.length}
              </span>
            )}
          </Link>

          <Link to="/checkout" className="btn btn-outline" style={{ position: 'relative' }}>
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--accent-primary)', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                {cartCount}
              </span>
            )}
          </Link>

          {currentUser ? (
            <>
              <Link to="/profile" className="btn btn-outline" title="Profile">
                <User size={20} />
              </Link>
              <Link to="/dashboard" className="btn btn-outline" title="Admin">
                <Package size={20} />
              </Link>
              <button onClick={handleLogout} className="btn btn-primary" title="Logout">
                <LogOut size={20} />
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
