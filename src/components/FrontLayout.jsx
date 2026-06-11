import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import SearchBar from './SearchBar';

// 前台布局
export default function FrontLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const { user } = useUser();

  const navLinks = [
    { key: '/', label: '首页' },
    { key: '/category', label: '分类' },
  ];

  return (
    <div className="page-shell">

      {/* 顶部导航 */}
      <header className="site-header">
        <div className="site-header-inner">
          <a className="site-logo" href="/" onClick={function (e) { e.preventDefault(); navigate('/'); }}>
            星舟商城
          </a>

          <nav className="site-nav">
            {navLinks.map(function (link) {
              const active = location.pathname === link.key;
              return (
                <a key={link.key} className={'site-nav-link' + (active ? ' active' : '')}
                  href={link.key} onClick={function (e) { e.preventDefault(); navigate(link.key); }}>
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="site-actions">
            <button className="site-action-btn" onClick={function () { navigate('/category'); }} title="搜索">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 12L16.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>

            <button className="site-action-btn" onClick={function () { navigate('/cart'); }} title="购物车">
              <Badge count={cartCount} size="small" offset={[2, -2]}>
                <ShoppingCartOutlined style={{ fontSize: 18 }} />
              </Badge>
            </button>

            <button className="site-action-btn" onClick={function () { navigate('/profile'); }} title="我的">
              <UserOutlined style={{ fontSize: 18 }} />
            </button>

            {user ? (
              <span className="site-user-name">{user.nickname}</span>
            ) : (
              <a className="site-auth-link" href="/login" onClick={function (e) { e.preventDefault(); navigate('/login'); }}>
                登录
              </a>
            )}

            <a className="site-admin-link" href="/admin/login" onClick={function (e) { e.preventDefault(); navigate('/admin/login'); }}>
              管理
            </a>
          </div>
        </div>
      </header>

      {/* 页面 */}
      <main className="page-content"><Outlet /></main>

      {/* 页脚 */}
      <footer className="site-footer">
        <div className="container">
          <p>星舟商城</p>
          <p className="footer-copy">© 2026 星舟商城. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
