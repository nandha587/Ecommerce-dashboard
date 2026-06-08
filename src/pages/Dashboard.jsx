import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import { Trash2, Plus, BarChart3, Package, DollarSign, Users } from 'lucide-react';

export default function Dashboard() {
  const { products, addProduct, removeProduct } = useProducts();
  const { orders } = useOrders();
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' or 'products'

  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', image: '', category: '' });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    await addProduct({
      ...newProduct,
      price: parseFloat(newProduct.price)
    });
    setNewProduct({ name: '', price: '', description: '', image: '', category: '' });
    setIsAdding(false);
  };

  // Analytics Calculations
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  // Estimate unique users based on unique userIds in orders (mock logic)
  const uniqueUsers = new Set(orders.map(o => o.userId)).size;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2>Admin Dashboard</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <button 
          className={`btn ${activeTab === 'analytics' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('analytics')}
          style={activeTab === 'analytics' ? {} : { border: 'none' }}
        >
          <BarChart3 size={20} /> Analytics
        </button>
        <button 
          className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('products')}
          style={activeTab === 'products' ? {} : { border: 'none' }}
        >
          <Package size={20} /> Products
        </button>
      </div>

      {activeTab === 'analytics' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '12px', color: '#10b981' }}>
                <DollarSign size={32} />
              </div>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Revenue</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>${totalRevenue.toFixed(2)}</div>
              </div>
            </div>
            
            <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '12px', color: '#8b5cf6' }}>
                <Package size={32} />
              </div>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Orders</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{totalOrders}</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(14, 165, 233, 0.2)', borderRadius: '12px', color: '#0ea5e9' }}>
                <Users size={32} />
              </div>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Active Customers</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{uniqueUsers}</div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Recent Orders</h3>
            {orders.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No orders have been placed yet.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <th style={{ padding: '1rem' }}>Order ID</th>
                    <th style={{ padding: '1rem' }}>Customer</th>
                    <th style={{ padding: '1rem' }}>Date</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(order => (
                    <tr key={order.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem', fontWeight: '500' }}>{order.id}</td>
                      <td style={{ padding: '1rem' }}>{order.userId}</td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{new Date(order.date).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem', textAlign: 'right', color: 'var(--accent-secondary)' }}>${order.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div>
          <div className="flex justify-end mb-4">
            <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)}>
              <Plus size={20} /> Add Product
            </button>
          </div>

          {isAdding && (
            <div className="glass-card mb-6" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Add New Product</h3>
              <form onSubmit={handleAddProduct} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-input" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Price</label>
                  <input type="number" step="0.01" className="form-input" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input type="text" className="form-input" required placeholder="e.g. Electronics" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input type="url" className="form-input" required value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows="3" required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}></textarea>
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary">Save Product</button>
                  <button type="button" className="btn btn-outline" onClick={() => setIsAdding(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <th style={{ padding: '1rem' }}>Image</th>
                  <th style={{ padding: '1rem' }}>Name</th>
                  <th style={{ padding: '1rem' }}>Category</th>
                  <th style={{ padding: '1rem' }}>Price</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>
                      <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{product.name}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{product.category}</td>
                    <td style={{ padding: '1rem', color: 'var(--accent-secondary)' }}>${Number(product.price).toFixed(2)}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button 
                        onClick={() => removeProduct(product.id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }}
                        title="Delete Product"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
