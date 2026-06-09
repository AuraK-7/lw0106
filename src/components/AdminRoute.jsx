import { Result } from 'antd';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';

// 后台守卫同时处理登录校验与模块权限校验。
export function AdminRoute({ children, permission }) {
  const { isLogin, permissions } = useAdmin();
  const location = useLocation();

  if (!isLogin) {
    return <Navigate replace state={{ from: location }} to="/admin/login" />;
  }

  if (permission && !permissions.includes(permission)) {
    return <Result status="403" subTitle="当前角色无权访问该后台模块。" title="无访问权限" />;
  }

  return children;
}
