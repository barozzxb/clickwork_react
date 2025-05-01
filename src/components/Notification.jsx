import React from 'react';
import { useNotification } from '../context/NotificationContext';

export default function Notification() {
  const { message } = useNotification();

  if (!message) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        padding: '10px 20px',
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: '4px',
        zIndex: 1000,
      }}
    >
      {message}
    </div>
  );
}
