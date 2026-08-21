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
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'kingshukdash123@gmail.com';
    
    const isEmailAdmin = admin?.user?.email?.toLowerCase() === adminEmail.toLowerCase();
    const isRoleAdmin = admin?.user?.role === 'ADMIN' || admin?.user?.role === 'SUPERADMIN';

    if (isEmailAdmin || isRoleAdmin) {
      return <Outlet />;
    }
  } catch (error) {
    console.error("Error parsing user data in AdminRoute", error);
  }

  return <Navigate to="/" replace />;
};

export default AdminRoute;
