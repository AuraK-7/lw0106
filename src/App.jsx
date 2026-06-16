import { Spin } from 'antd';
import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import { AdminRoute } from './components/AdminRoute';
import FrontLayout from './components/FrontLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

const ActivityPage = lazy(function () { return import('./pages/ActivityPage'); });
const HomePage = lazy(function () { return import('./pages/HomePage'); });
const ProductDetailPage = lazy(function () { return import('./pages/ProductDetailPage'); });
const SearchPage = lazy(function () { return import('./pages/SearchPage'); });
const CartPage = lazy(function () { return import('./pages/CartPage'); });
const CheckoutPage = lazy(function () { return import('./pages/CheckoutPage'); });
const PayPage = lazy(function () { return import('./pages/PayPage'); });
const OrderDetailPage = lazy(function () { return import('./pages/OrderDetailPage'); });
const OrderListPage = lazy(function () { return import('./pages/OrderListPage'); });
const ProfilePage = lazy(function () { return import('./pages/ProfilePage'); });
const UserAuthPage = lazy(function () { return import('./pages/UserAuthPage'); });
const NotFoundPage = lazy(function () { return import('./pages/NotFoundPage'); });
const AdminLoginPage = lazy(function () { return import('./pages/admin/AdminLoginPage'); });
const AdminDashboardPage = lazy(function () { return import('./pages/admin/AdminDashboardPage'); });
const ProductManagePage = lazy(function () { return import('./pages/admin/AdminModules').then(function (mod) { return { default: mod.ProductManagePage }; }); });
const CategoryManagePage = lazy(function () { return import('./pages/admin/AdminModules').then(function (mod) { return { default: mod.CategoryManagePage }; }); });
const OrderManagePage = lazy(function () { return import('./pages/admin/AdminModules').then(function (mod) { return { default: mod.OrderManagePage }; }); });
const PermissionPage = lazy(function () { return import('./pages/admin/AdminModules').then(function (mod) { return { default: mod.PermissionPage }; }); });

// 根组件负责组织前后台两套路由。
export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ padding: '64px 0', display: 'flex', justifyContent: 'center' }}><Spin size="large" /></div>}>
        <Routes>
          <Route element={<FrontLayout />} path="/">
            <Route element={<HomePage />} index />
            <Route element={<ActivityPage />} path="activity/:activityId" />
            <Route element={<ProductDetailPage />} path="product/:id" />
            <Route element={<SearchPage />} path="search" />
            <Route element={<ProtectedRoute><CartPage /></ProtectedRoute>} path="cart" />
            <Route element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} path="checkout" />
            <Route element={<ProtectedRoute><PayPage /></ProtectedRoute>} path="pay/:id" />
            <Route element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} path="order/:id" />
            <Route element={<ProtectedRoute><OrderListPage /></ProtectedRoute>} path="orders" />
            <Route element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} path="profile" />
            <Route element={<UserAuthPage />} path="login" />
            <Route element={<AdminLoginPage />} path="admin/login" />
          </Route>
          <Route element={<AdminRoute><AdminLayout /></AdminRoute>} path="/admin">
            <Route element={<AdminDashboardPage />} index />
            <Route element={<AdminRoute permission="products"><ProductManagePage /></AdminRoute>} path="products" />
            <Route element={<AdminRoute permission="categories"><CategoryManagePage /></AdminRoute>} path="categories" />
            <Route element={<AdminRoute permission="orders"><OrderManagePage /></AdminRoute>} path="orders" />
            <Route element={<AdminRoute permission="permissions"><PermissionPage /></AdminRoute>} path="permissions" />
          </Route>
          <Route element={<Navigate replace to="/" />} path="/home" />
          <Route element={<NotFoundPage />} path="*" />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
