import React from 'react';
import { Navigate } from "react-router-dom";

const SpecialistGuard = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('user_role');
  
  if (!token) return <Navigate to="/login" replace />;
  
  if (role === 'patient') {
      return <Navigate to="/dashboard" replace />;
  }

  if (role === 'admin') {
      return <Navigate to="/admin" replace />;
  }
  
  if (role === 'specialist') {
      return children;
  }

  return <Navigate to="/login" replace />;
};

export default SpecialistGuard;