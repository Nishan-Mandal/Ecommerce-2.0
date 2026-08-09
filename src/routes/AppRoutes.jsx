import React, { useEffect } from 'react';
import { Route, Routes, Outlet, useNavigate } from "react-router-dom";
import Home from "../pages/home/Home";
import Order from "../pages/order/Order";
import NoPage from "../pages/nopage/NoPage";
import Cart from "../pages/cart/Cart";
import Blog from "../pages/blog/Blog";
import Dashboard from "../admin/dashboard/Dashboard";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import { useAuth } from "../context/AuthContext";
import Orders from "../admin/orders/Orders";
import Products from "../admin/products/Products";
import AdminUsersPage from "../admin/User/AdminUsersPage";
import AddProduct from "../admin/products/AddProduct";
import UpdateProduct from "../admin/products/UpdateProduct";
import Allproducts from '../pages/allproducts/Allproducts';
import Admin from "../admin/Admin";
import Coupons from "../admin/coupons/Coupons";
import CouponFormPage from "../admin/coupons/CouponForm/CouponForm";
import AboutUs from '../pages/consumerservice/AboutUs';
import PrivacyPolicy from '../pages/consumerservice/PrivacyPolicy';
import ReturnPolicy from '../pages/consumerservice/ReturnPolicy';
import TermsConditions from '../pages/consumerservice/TermsConditions';
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import Review from '../admin/Review/Review';
import Configure from '../admin/configure/Configure';
import Layout from "../components/layout/Layout";
import User from '../pages/user/User';

import ShippingPolicy from '../pages/consumerservice/ShippingPolicy';
import RefundPolicy from '../pages/consumerservice/RefundPolicy';
import CustomLegalPage from '../pages/consumerservice/CustomLegalPage';
import CheckoutPage from '../pages/checkout/CheckoutPage';
import AdminOrderDetail from '../admin/orders/AdminOrderDetail';
import OrderInvoice from '../admin/orders/OrderInvoice';

function LoginRedirect() {
  const navigate = useNavigate();
  const { setIsLoginOpen } = useAuth();
  useEffect(() => {
    setIsLoginOpen(true);
    navigate('/', { replace: true });
  }, [setIsLoginOpen, navigate]);
  return null;
}

function SignupRedirect() {
  const navigate = useNavigate();
  const { setIsSignupOpen } = useAuth();
  useEffect(() => {
    setIsSignupOpen(true);
    navigate('/', { replace: true });
  }, [setIsSignupOpen, navigate]);
  return null;
}

function AppLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Routes wrapped in Global Layout */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/allproducts" element={<Allproducts />} />
        <Route path="/cart" element={<Cart />} />
        <Route path='/productdetails/:id' element={<ProductDetails />} />
        
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/returnpolicy" element={<ReturnPolicy />} />
        <Route path="/termsconditions" element={<TermsConditions />} />
        <Route path="/shippingpolicy" element={<ShippingPolicy />} />
        <Route path="/refundpolicy" element={<RefundPolicy />} />
        <Route path="/legal/:slug" element={<CustomLegalPage />} />
        <Route path="/blog" element={<Blog />} />
        {/* User Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order" element={<Order />} />
          <Route path="/profile" element={<User />} />
        </Route>
      </Route>

      {/* Auth Routes (Redirects to Home + Modal trigger) */}
      <Route path="/login" element={<LoginRedirect />} />
      <Route path="/signup" element={<SignupRedirect />} />

      {/* Admin Protected Routes */}
      <Route element={<AdminRoute />}>
        <Route element={<Admin />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/products" element={<Products />} />
          <Route path="/users" element={<AdminUsersPage />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/updateproduct" element={<UpdateProduct />} />
          <Route path="/coupons" element={<Coupons />} />
          <Route path="/coupons/add" element={<CouponFormPage />} />
          <Route path="/coupons/edit" element={<CouponFormPage />} />
          <Route path="/reviews" element={<Review />} />
          <Route path="/review" element={<Review />} />
          <Route path="/configure" element={<Configure />} />
          <Route path="/admin/order/:id" element={<AdminOrderDetail />} />
          <Route path="/admin/order/:id/invoice" element={<OrderInvoice />} />
        </Route>
      </Route>

      <Route path="/*" element={<NoPage />} />
    </Routes>
  );
}
