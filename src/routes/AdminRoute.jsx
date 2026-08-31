import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const AdminRoute = () => {
  const userString = localStorage.getItem('user');
  const location = useLocation();

  if (!userString) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const admin = JSON.parse(userString);
    const role = admin?.user?.role;
    const isRoleAdmin = role === 'ADMIN' || role === 'SUPERADMIN';

    if (isRoleAdmin) {
      return <Outlet />;
    }
  } catch (error) {
    console.error("Error parsing user data in AdminRoute", error);
  }

  return <Navigate to="/" replace />;
};

export default AdminRoute;
