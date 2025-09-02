import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children, user }) => {
  return !user ? children : <Navigate to="/profile" replace />;
};

export default PublicRoute;