import React, { useState, useMemo } from 'react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

export default function Home() {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const location = useLocation();
  
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchQuery) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }

    if (sort === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, searchQuery, category, sort]);

  if (loading) {
    return <div className="text-center mt-4">Loading products...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Welcome to Nexus<span style={{ color: 'var(--accent-primary)' }}>Store</span></h1>
        <p style={{ fontSize: '1.2rem' }}>Discover premium products with real-time availability.</p>
      </div>

      <div className="flex justify-between items-center mb-4 glass-card" style={{ padding: '1rem' }}>
        <div className="flex gap-2">
          {categories.map(cat => (
            <button 
              key={cat}
              className={`btn ${category === cat ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <select 
          className="form-input" 
          style={{ width: 'auto' }} 
          value={sort} 
          onChange={e => setSort(e.target.value)}
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {searchQuery && (
        <h3 style={{ marginBottom: '1.5rem' }}>Search results for "{searchQuery}" ({filteredProducts.length})</h3>
      )}

      {filteredProducts.length === 0 ? (
        <div className="text-center" style={{ marginTop: '4rem', color: 'var(--text-secondary)' }}>
          <h3>No products found.</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {filteredProducts.map(product => {
            const avgRating = product.reviews?.length > 0 
              ? product.reviews.reduce((a, b) => a + b.rating, 0) / product.reviews.length 
              : 0;

            return (
              <div key={product.id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <button 
                  onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer', zIndex: 10 }}
                >
                  <Heart size={20} color={isInWishlist(product.id) ? '#ef4444' : 'white'} fill={isInWishlist(product.id) ? '#ef4444' : 'none'} />
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
                  <div className="flex justify-between items-start mb-2">
                    <Link to={`/product/${product.id}`} style={{ color: 'var(--text-primary)' }}>
                      <h3 style={{ fontSize: '1.2rem' }}>{product.name}</h3>
                    </Link>
                  </div>
                  {avgRating > 0 && (
                    <div className="flex items-center gap-1 mb-2" style={{ color: '#fbbf24', fontSize: '0.875rem' }}>
                      <Star size={14} fill="#fbbf24" />
                      <span>{avgRating.toFixed(1)} ({product.reviews.length} reviews)</span>
                    </div>
                  )}
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
            );
          })}
        </div>
      )}
    </div>
  );
}
