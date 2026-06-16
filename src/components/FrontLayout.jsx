import {
  EnvironmentOutlined,
  LogoutOutlined,
  OrderedListOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Badge, Dropdown, message } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { APP_NAME } from '../constants/app';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';

export default function FrontLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const { user, logout } = useUser();

  const navLinks = [
    { key: '/', label: '首页' },
    { key: '/category', label: '分类' },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: function () { navigate('/profile?section=overview'); },
    },
    {
      key: 'orders',
      icon: <OrderedListOutlined />,
      label: '我的订单',
      onClick: function () { navigate('/orders'); },
    },
    {
      key: 'addresses',
      icon: <EnvironmentOutlined />,
      label: '地址管理',
      onClick: function () { navigate('/profile?section=addresses'); },
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: function () {
        logout();
        message.success('已退出登录');
        navigate('/');
      },
    },
  ];

  const menuConfig = {
    style: {
      minWidth: '220px',
      padding: '8px',
    },
    items: userMenuItems,
  };

  return (
    <div className="page-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <a className="site-logo" href="/" onClick={function (event) { event.preventDefault(); navigate('/'); }}>
            {APP_NAME}
          </a>

          <nav className="site-nav">
            {navLinks.map(function (link) {
              const active = link.key === '/' ? location.pathname === '/' : location.pathname.startsWith(link.key);
              return (
                <a
                  key={link.key}
                  className={'site-nav-link' + (active ? ' active' : '')}
                  href={link.key}
                  onClick={function (event) { event.preventDefault(); navigate(link.key); }}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="site-actions">
            <button className="site-action-btn" onClick={function () { navigate('/category'); }} title="搜索">
              <SearchOutlined style={{ fontSize: 18 }} />
            </button>
            <button className="site-action-btn" onClick={function () { navigate('/cart'); }} title="购物车">
              <Badge count={cartCount} size="small" offset={[2, -2]}>
                <ShoppingCartOutlined style={{ fontSize: 18 }} />
              </Badge>
            </button>
            {user ? (
              <Dropdown
                menu={menuConfig}
                trigger={['click']}
                placement="bottomRight"
                overlayStyle={{
                  borderRadius: '16px',
                  boxShadow: '0 8px 30px rgba(0,0,0,.08)',
                  overflow: 'hidden',
                }}
              >
                <button
                  className="user-menu-trigger"
                  onClick={function (event) { event.preventDefault(); }}
                >
                  <span
                    className="user-menu-avatar"
                    style={user.avatar && user.avatar.startsWith('data:') ? {
                      backgroundImage: `url(${user.avatar})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    } : {}}
                  >
                    {(!user.avatar || !user.avatar.startsWith('data:')) && <UserOutlined />}
                  </span>
                  <span className="user-menu-name">{user.nickname || user.username}</span>
                  <svg className="user-menu-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </Dropdown>
            ) : (
              <a className="site-auth-link" href="/login" onClick={function (event) { event.preventDefault(); navigate('/login'); }}>
                登录
              </a>
            )}
            <a className="site-admin-link" href="/admin/login" onClick={function (event) { event.preventDefault(); navigate('/admin/login'); }}>
              管理
            </a>
          </div>
        </div>
      </header>

      <main className="page-content"><Outlet /></main>

      <footer className="site-footer">
        <div className="container">
          <p>{APP_NAME}</p>
          <p className="footer-copy">© 2026 {APP_NAME}. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        .user-menu-trigger {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px 6px 6px;
          border: none;
          border-radius: 24px;
          background: transparent;
          cursor: pointer;
          color: #1d1d1f;
          transition: all .25s ease;
          outline: none;
          font-size: 14px;
          font-family: inherit;
        }
        .user-menu-trigger:hover {
          background: #f5f5f7;
        }
        .user-menu-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f5f5f7;
          border: 1px solid #e5e5e7;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: #6e6e73;
          flex-shrink: 0;
          overflow: hidden;
        }
        .user-menu-name {
          font-size: 14px;
          font-weight: 500;
          color: #1d1d1f;
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .user-menu-chevron {
          opacity: 0.5;
          transition: transform .25s ease;
          flex-shrink: 0;
        }
        .user-menu-trigger:hover .user-menu-chevron {
          opacity: 0.8;
        }
        .ant-dropdown-menu {
          border-radius: 16px;
          padding: 8px;
          box-shadow: 0 8px 30px rgba(0,0,0,.08);
        }
        .ant-dropdown-menu-item {
          min-height: 44px;
          padding: 0 12px !important;
          border-radius: 10px;
          font-size: 14px;
          color: #1d1d1f;
          transition: background .15s;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ant-dropdown-menu-item:hover {
          background: #f5f5f7;
        }
        .ant-dropdown-menu-item .anticon {
          font-size: 16px;
          opacity: 0.65;
        }
        .ant-dropdown-menu-item-danger {
          color: #ff3b30;
        }
        .ant-dropdown-menu-item-divider {
          margin: 8px 12px;
        }
      `}</style>
    </div>
  );
}
