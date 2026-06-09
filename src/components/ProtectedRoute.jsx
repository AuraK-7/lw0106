import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

// 前台登录态守卫，未登录用户会被重定向到登录页。
export function ProtectedRoute({ children }) {
  const { isLogin } = useUser();
  const location = useLocation();

  if (!isLogin) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return children;
}
