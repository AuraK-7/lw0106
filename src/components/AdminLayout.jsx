import { AppstoreOutlined, DashboardOutlined, LogoutOutlined, OrderedListOutlined, SafetyCertificateOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Space, Typography } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';

const { Header, Sider, Content } = Layout;

// 后台布局组件，菜单会根据角色权限动态展示。
export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, logout, permissions } = useAdmin();

  const allMenus = [
    { key: '/admin', icon: <DashboardOutlined />, label: '控制台', permission: 'dashboard' },
    { key: '/admin/products', icon: <ShoppingOutlined />, label: '商品管理', permission: 'products' },
    { key: '/admin/categories', icon: <AppstoreOutlined />, label: '分类管理', permission: 'categories' },
    { key: '/admin/orders', icon: <OrderedListOutlined />, label: '订单管理', permission: 'orders' },
    { key: '/admin/permissions', icon: <SafetyCertificateOutlined />, label: '权限管理', permission: 'permissions' },
  ];

  const menuItems = allMenus.filter(function (item) { return permissions.includes(item.permission); });
  const selectedKey = menuItems.find(function (item) { return location.pathname === item.key || location.pathname.startsWith(item.key + '/'); })?.key || '/admin';

  return (
    <Layout className="admin-shell">
      <Sider breakpoint="lg" className="admin-sider" width={220}>
        <div className="admin-logo">商城管理后台</div>
        <Menu items={menuItems} mode="inline" selectedKeys={[selectedKey]} theme="dark" onClick={function (info) { navigate(info.key); }} />
      </Sider>
      <Layout>
        <Header className="admin-header">
          <Space>
            <Typography.Text>当前登录：{admin?.name}</Typography.Text>
            <Typography.Text type="secondary">{admin?.roleName}</Typography.Text>
          </Space>
          <Button icon={<LogoutOutlined />} onClick={function () { logout(); navigate('/admin/login'); }}>退出后台</Button>
        </Header>
        <Content className="admin-content"><Outlet /></Content>
      </Layout>
    </Layout>
  );
}
