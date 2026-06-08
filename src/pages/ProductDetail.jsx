import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Star, ArrowLeft } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addReview } = useProducts();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  
  const product = products.find(p => p.id === id);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!product) {
    return <div className="text-center mt-4">Product not found.</div>;
  }

  const avgRating = product.reviews?.length > 0 
    ? product.reviews.reduce((a, b) => a + b.rating, 0) / product.reviews.length 
    : 0;

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) return;
    addReview(product.id, {
      user: currentUser.email.split('@')[0],
      rating: Number(rating),
      comment
    });
    setComment('');
    setRating(5);
  };

  return (
    <div>
      <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={20} /> Back
      </button>

      <div className="glass-card" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
        <div>
          <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '12px', objectFit: 'cover' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: 'var(--accent-secondary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>{product.category}</div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{product.name}</h1>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex" style={{ color: '#fbbf24' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} size={20} fill={star <= Math.round(avgRating) ? "#fbbf24" : "none"} />
              ))}
            </div>
            <span style={{ color: 'var(--text-secondary)' }}>
              {product.reviews?.length || 0} Reviews
            </span>
          </div>

          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem', flex: 1 }}>
            {product.description}
          </p>

          <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-secondary)', marginBottom: '1rem' }}>
              ${Number(product.price).toFixed(2)}
            </div>
            <button className="btn btn-primary w-full" onClick={() => addToCart(product)} style={{ fontSize: '1.1rem', padding: '1rem' }}>
              <ShoppingCart size={20} /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <h2 style={{ marginBottom: '1.5rem' }}>Customer Reviews</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Write a Review</h3>
          {currentUser ? (
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label className="form-label">Rating</label>
                <select className="form-input" value={rating} onChange={e => setRating(e.target.value)}>
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Poor</option>
                  <option value="1">1 - Terrible</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Review</label>
                <textarea className="form-input" rows="4" required value={comment} onChange={e => setComment(e.target.value)}></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Submit Review</button>
            </form>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>You must be logged in to leave a review.</p>
          )}
        </div>

        <div>
          {(!product.reviews || product.reviews.length === 0) ? (
            <p style={{ color: 'var(--text-secondary)' }}>No reviews yet. Be the first!</p>
          ) : (
            product.reviews.map((review, i) => (
              <div key={i} className="glass-card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                <div className="flex justify-between items-center mb-2">
                  <span style={{ fontWeight: 'bold' }}>{review.user}</span>
                  <div className="flex" style={{ color: '#fbbf24' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={14} fill={star <= review.rating ? "#fbbf24" : "none"} />
                    ))}
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
