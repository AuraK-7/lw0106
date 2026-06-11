import React from 'react';
import ReactDOM from 'react-dom/client';
import 'antd/dist/reset.css';
import './styles/global-theme.css';
import './styles/global-layout.css';
import './styles/global-components.css';
import './index.css';
import App from './App';
import { AdminProvider } from './contexts/AdminContext';
import { CartProvider } from './contexts/CartContext';
import { UserProvider } from './contexts/UserContext';
import { initializeMallData } from './utils/mallStore';

// 启动时先初始化本地数据仓库，再挂载应用。
initializeMallData();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AdminProvider>
      <UserProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </UserProvider>
    </AdminProvider>
  </React.StrictMode>
);
