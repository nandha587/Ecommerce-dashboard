import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ProductContext = createContext();

export function useProducts() {
  return useContext(ProductContext);
}

const mockProducts = [
  { id: '1', name: 'Premium Wireless Headphones', price: 299.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800', description: 'High-fidelity audio with active noise cancellation.', category: 'Electronics', reviews: [{ user: 'Alex', rating: 5, comment: 'Amazing sound quality!' }] },
  { id: '2', name: 'Mechanical Keyboard', price: 149.99, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800', description: 'RGB mechanical keyboard with tactile switches.', category: 'Electronics', reviews: [] },
  { id: '3', name: 'Ultra-wide Monitor', price: 799.00, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800', description: '34-inch curved display for immersive productivity.', category: 'Electronics', reviews: [] },
  { id: '4', name: 'Smart Watch', price: 199.50, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800', description: 'Fitness tracking, notifications, and heart rate monitor.', category: 'Wearables', reviews: [{ user: 'Sam', rating: 4, comment: 'Good battery life.' }] },
];

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('localProducts');
    return saved ? JSON.parse(saved) : mockProducts;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('localProducts', JSON.stringify(products));
  }, [products]);

  const addProduct = async (product) => {
    const newProduct = { ...product, id: Date.now().toString(), reviews: [] };
    setProducts(prev => [...prev, newProduct]);
  };

  const removeProduct = async (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addReview = (productId, review) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, reviews: [...(p.reviews || []), review] };
      }
      return p;
    }));
  };

  const value = {
    products,
    loading,
    addProduct,
    removeProduct,
    addReview
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}
