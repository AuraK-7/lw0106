import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentAdmin, loginAdmin, logoutAdmin, subscribeMallChange } from '../utils/mallStore';

const AdminContext = createContext(null);

// 后台上下文负责维护管理员登录态与权限信息。
export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(function () {
    return getCurrentAdmin();
  });

  useEffect(function () {
    return subscribeMallChange(function () {
      setAdmin(getCurrentAdmin());
    });
  }, []);

  const value = useMemo(function () {
    return { admin, isLogin: Boolean(admin), permissions: admin ? admin.permissions : [], login: loginAdmin, logout: logoutAdmin };
  }, [admin]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  return useContext(AdminContext);
}
