import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { User, Package } from 'lucide-react';

export default function Profile() {
  const { currentUser } = useAuth();
  const { getOrdersByUser } = useOrders();

  const userOrders = currentUser ? getOrdersByUser(currentUser.uid || currentUser.email) : [];

  if (!currentUser) return null;

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>My Profile</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* User Info */}
        <div className="glass-card" style={{ padding: '2rem', height: 'fit-content' }}>
          <div className="flex items-center gap-4 mb-4">
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={40} color="white" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{currentUser.email.split('@')[0]}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{currentUser.email}</p>
            </div>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Status: <span style={{ color: '#10b981', fontWeight: 'bold' }}>Active Member</span></p>
          </div>
        </div>

        {/* Order History */}
        <div>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={24} /> Order History
          </h3>

          {userOrders.length === 0 ? (
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              You haven't placed any orders yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {userOrders.map(order => (
                <div key={order.id} className="glass-card" style={{ padding: '1.5rem' }}>
                  <div className="flex justify-between items-start mb-4" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Order #{order.id}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                      </div>
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>
                      ${order.total.toFixed(2)}
                    </div>
                  </div>
                  
                  <div>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Items:</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                          <span>{item.quantity}x {item.name}</span>
                          <span style={{ color: 'var(--text-secondary)' }}>${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
