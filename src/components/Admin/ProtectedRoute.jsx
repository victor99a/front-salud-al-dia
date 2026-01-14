import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isAdmin } from '../../services/AuthService';

const ProtectedRoute = ({ children }) => {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    let mounted = true;
    isAdmin().then(result => {
      if (mounted) setAuthorized(result);
    });
    return () => mounted = false;
  }, []);

  if (authorized === null) {
    return <div className="loading-screen">Verificando permisos de administrador...</div>;
  }

  return authorized ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;