// src/components/ProtectedRoutes.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

/**
 * allowedRoles: mảng role (string) được phép
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    // Chưa đăng nhập
    return <Navigate to="/login" replace />;
  }

  let role;
  try {
    const decoded = jwtDecode(token);
    role = decoded.role;
  } catch (err) {
    // Token không hợp lệ
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    // Không có quyền
    return <Navigate to="/404" replace />;
  }

  // Có quyền → render các route con
  return <Outlet />;
};

export default ProtectedRoute;
