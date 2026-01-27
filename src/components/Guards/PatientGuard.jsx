import React from 'react';
import { Navigate } from "react-router-dom";

const PatientGuard = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("user_role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (role === 'specialist') {
    return <Navigate to="/panel-medico" replace />;
  }

  return children;
};

export default PatientGuard;