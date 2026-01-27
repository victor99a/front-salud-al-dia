import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminGuard = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('user_role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'patient') {
    return <Navigate to="/dashboard" replace />;
  }

  if (role === 'specialist') {
    return <Navigate to="/panel-medico" replace />;
  }

  if (role === 'admin') {
    return children;
  }

  return <Navigate to="/" replace />;
};

export default AdminGuard;