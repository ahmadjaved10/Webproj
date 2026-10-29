import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ element, role = 'supplier' }) => {
  const location = useLocation();
  const isAuthenticated = Boolean(localStorage.getItem('authToken'));
  const currentRole = localStorage.getItem('authRole') || 'supplier';

  if (!isAuthenticated) {
    const loginPath = role === 'customer' ? '/customer/login' : role === 'admin' ? '/admin/login' : '/login';
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  if (currentRole !== role) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default PrivateRoute;