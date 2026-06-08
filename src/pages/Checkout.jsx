import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Trash2, Minus, Plus, CreditCard } from 'lucide-react';

// Use a mock test key for Stripe
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const CheckoutForm = ({ total, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) return;

    setProcessing(true);
    
    // Simulate API call for payment intent
    setTimeout(async () => {
      const cardElement = elements.getElement(CardElement);
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setError(error.message);
        setProcessing(false);
      } else {
        setError(null);
        setProcessing(false);
        onSuccess(paymentMethod);
      }
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2rem' }}>
      <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <CreditCard size={24} /> Payment Details
      </h3>
      
      <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '1.5rem' }}>
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#f8fafc',
              '::placeholder': { color: '#94a3b8' },
              iconColor: '#8b5cf6'
            },
            invalid: { color: '#ef4444' }
          }
        }} />
      </div>

      {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

      <button type="submit" disabled={!stripe || processing} className="btn btn-primary w-full" style={{ padding: '1rem', fontSize: '1.1rem' }}>
        {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
      </button>
    </form>
  );
};

export default function Checkout() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const [success, setSuccess] = useState(false);

  const handleSuccess = (paymentMethod) => {
    setSuccess(true);
    clearCart();
  };

  if (success) {
    return (
      <div className="text-center" style={{ marginTop: '4rem' }}>
        <div className="glass-card" style={{ display: 'inline-block', padding: '3rem', maxWidth: '500px' }}>
          <h2 style={{ color: 'var(--accent-secondary)', marginBottom: '1rem' }}>Payment Successful!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Thank you for your purchase. Your order has been processed securely.
          </p>
          <a href="/" className="btn btn-primary">Return to Shop</a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Checkout</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Cart Review Section */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Order Summary</h3>
          {cartItems.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>Your cart is empty.</p>
          ) : (
            <div>
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center" style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: '500' }}>{item.name}</div>
                      <div style={{ color: 'var(--accent-secondary)' }}>${Number(item.price).toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.05)', padding: '0.25rem', borderRadius: '8px' }}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><Minus size={16}/></button>
                      <span style={{ width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><Plus size={16}/></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={20}/>
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between items-center mt-4" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                <span>Total:</span>
                <span style={{ color: 'var(--accent-secondary)' }}>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Payment Section */}
        <div>
          {cartItems.length > 0 && (
            <Elements stripe={stripePromise}>
              <CheckoutForm total={cartTotal} onSuccess={handleSuccess} />
            </Elements>
          )}
        </div>

      </div>
    </div>
  );
}
