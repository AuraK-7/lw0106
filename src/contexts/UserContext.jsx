import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, loginUser, logoutUser, registerUser, subscribeMallChange } from '../utils/mallStore';

const UserContext = createContext(null);

// 用户上下文负责维护前台登录态。
export function UserProvider({ children }) {
  const [user, setUser] = useState(function () {
    return getCurrentUser();
  });

  useEffect(function () {
    return subscribeMallChange(function () {
      setUser(getCurrentUser());
    });
  }, []);

  const value = useMemo(function () {
    return { user, isLogin: Boolean(user), login: loginUser, register: registerUser, logout: logoutUser };
  }, [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
