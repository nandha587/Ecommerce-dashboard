import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { ShoppingCart, HeartOff } from 'lucide-react';

export default function Wishlist() {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>My Wishlist</h2>
      
      {wishlistItems.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Your wishlist is empty.</h3>
          <Link to="/" className="btn btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {wishlistItems.map(product => (
            <div key={product.id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <button 
                onClick={() => toggleWishlist(product)}
                style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(239, 68, 68, 0.9)', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer', zIndex: 10 }}
                title="Remove from wishlist"
              >
                <HeartOff size={20} color="white" />
              </button>
              
              <Link to={`/product/${product.id}`} style={{ height: '200px', overflow: 'hidden', display: 'block' }}>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </Link>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Link to={`/product/${product.id}`} style={{ color: 'var(--text-primary)' }}>
                  <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>{product.name}</h3>
                </Link>
                <div className="flex justify-between items-center mt-auto pt-4">
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>
                    ${Number(product.price).toFixed(2)}
                  </span>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      addToCart(product);
                      toggleWishlist(product); // Optionally remove from wishlist after adding to cart
                    }}
                  >
                    <ShoppingCart size={16} />
                    Move to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
