import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import { AdminRoute } from './components/AdminRoute';
import FrontLayout from './components/FrontLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import ActivityPage from './pages/ActivityPage';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PayPage from './pages/PayPage';
import OrderDetailPage from './pages/OrderDetailPage';
import OrderListPage from './pages/OrderListPage';
import ProfilePage from './pages/ProfilePage';
import UserAuthPage from './pages/UserAuthPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import { CategoryManagePage, OrderManagePage, PermissionPage, ProductManagePage } from './pages/admin/AdminModules';

// 根组件负责组织前后台两套路由。
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<FrontLayout />} path="/">
          <Route element={<HomePage />} index />
          <Route element={<ActivityPage />} path="activity/:activityId" />
          <Route element={<SearchPage />} path="search" />
          <Route element={<ProductDetailPage />} path="product/:id" />
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
    </BrowserRouter>
  );
}
