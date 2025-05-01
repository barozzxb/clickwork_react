import React, { createContext, useState, useContext, useCallback } from 'react';

// 1. Khởi tạo context
const NotificationContext = createContext();

// 2. Provider component
export function NotificationProvider({ children }) {
  const [message, setMessage] = useState(null);

  // setMessage đi kèm auto-clear sau X giây
  const showMessage = useCallback((msg, duration = 3000) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), duration);
  }, []);

  return (
    <NotificationContext.Provider value={{ message, showMessage }}>
      {children}
    </NotificationContext.Provider>
  );
}

// 3. Custom hook để các component khác dùng
export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotification phải được dùng trong NotificationProvider");
  }
  return ctx;
}
