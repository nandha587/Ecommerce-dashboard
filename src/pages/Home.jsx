import React from 'react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';

export default function Home() {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();

  if (loading) {
    return <div className="text-center mt-4">Loading products...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Welcome to Nexus<span style={{ color: 'var(--accent-primary)' }}>Store</span></h1>
        <p style={{ fontSize: '1.2rem' }}>Discover premium products with real-time availability.</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '2rem' 
      }}>
        {products.map(product => (
          <div key={product.id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '200px', overflow: 'hidden' }}>
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>{product.name}</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>{product.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>
                  ${Number(product.price).toFixed(2)}
                </span>
                <button 
                  className="btn btn-primary"
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
