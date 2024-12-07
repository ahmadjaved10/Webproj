import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  // Check if there's an auth token in localStorage
  const isAuthenticated = localStorage.getItem('authToken');

  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If authenticated, render the element (component) passed as a prop
  return element;
};

export default PrivateRoute;