import { Badge, Button, Layout, Menu, Space, Typography } from 'antd';
import { AppstoreOutlined, HomeOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import SearchBar from './SearchBar';

const { Header, Content, Footer } = Layout;

// 前台布局组件，统一负责导航、搜索入口和页脚。
export default function FrontLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const { user, logout } = useUser();

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: '首页' },
    { key: '/category', icon: <AppstoreOutlined />, label: '分类' },
    { key: '/cart', icon: <Badge count={cartCount} size="small"><ShoppingCartOutlined /></Badge>, label: '购物车' },
    { key: '/profile', icon: <UserOutlined />, label: '我的' },
  ];

  const selectedKey = menuItems.find(function (item) {
    return location.pathname === item.key || location.pathname.startsWith(item.key + '/');
  })?.key;

  return (
    <Layout className="page-shell">
      <Header className="front-header">
        <div className="container front-header-inner">
          <Typography.Title className="brand-title" level={3} onClick={function () { navigate('/'); }}>星舟商城</Typography.Title>
          <div className="header-search">
            <SearchBar defaultValue="" onSearch={function (value) { navigate('/category?keyword=' + encodeURIComponent(value || '')); }} />
          </div>
          <Space>
            {user ? (
              <>
                <Typography.Text className="welcome-text">你好，{user.nickname}</Typography.Text>
                <Button onClick={function () { logout(); navigate('/'); }}>退出登录</Button>
              </>
            ) : (
              <Button type="primary" onClick={function () { navigate('/login'); }}>登录 / 注册</Button>
            )}
            <Button onClick={function () { navigate('/admin/login'); }}>后台入口</Button>
          </Space>
        </div>
      </Header>
      <div className="front-nav-wrap">
        <div className="container">
          <Menu mode="horizontal" items={menuItems} selectedKeys={selectedKey ? [selectedKey] : []} onClick={function (info) { navigate(info.key); }} />
        </div>
      </div>
      <Content className="page-content"><div className="container"><Outlet /></div></Content>
      <Footer className="site-footer">© 2026 星舟商城. 保留所有权利.</Footer>
    </Layout>
  );
}
