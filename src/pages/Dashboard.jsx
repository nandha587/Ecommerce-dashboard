import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { Trash2, Plus } from 'lucide-react';

export default function Dashboard() {
  const { products, addProduct, removeProduct } = useProducts();
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', image: '' });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    await addProduct({
      ...newProduct,
      price: parseFloat(newProduct.price)
    });
    setNewProduct({ name: '', price: '', description: '', image: '' });
    setIsAdding(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Product Management</h2>
        <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)}>
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {isAdding && (
        <div className="glass-card mb-4" style={{ padding: '1.5rem' }}>
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
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
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
  );
}
