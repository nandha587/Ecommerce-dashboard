import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export function useOrders() {
  return useContext(OrderContext);
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const getOrdersByUser = (userId) => {
    return orders.filter(order => order.userId === userId);
  };

  const value = {
    orders,
    addOrder,
    getOrdersByUser
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}
