import { Card, Col, List, Row, Space, Statistic, Tag, Typography } from 'antd';
import { useMallData } from '../../hooks/useMallData';
import { getDashboardStats, getOrders } from '../../utils/mallStore';

// 后台控制台展示全局统计和最近订单。
export default function AdminDashboardPage() {
  const stats = useMallData(function () { return getDashboardStats(); }, []);
  const recentOrders = useMallData(function () { return getOrders({ page: 1, pageSize: 5 }).list; }, []);
  return (
    <div className="page-section-stack"><Row gutter={[16, 16]}><Col lg={6} md={12} xs={24}><Card><Statistic title="商品总数" value={stats.productCount} /></Card></Col><Col lg={6} md={12} xs={24}><Card><Statistic title="上架商品" value={stats.onlineProductCount} /></Card></Col><Col lg={6} md={12} xs={24}><Card><Statistic title="分类数量" value={stats.categoryCount} /></Card></Col><Col lg={6} md={12} xs={24}><Card><Statistic title="注册用户" value={stats.userCount} /></Card></Col></Row><Row gutter={[16, 16]}><Col lg={12} xs={24}><Card title="订单提醒"><Space direction="vertical"><Typography.Text>待付款订单：{stats.pendingPayCount}</Typography.Text><Typography.Text>待发货订单：{stats.pendingShipCount}</Typography.Text><Typography.Text>订单总数：{stats.orderCount}</Typography.Text></Space></Card></Col><Col lg={12} xs={24}><Card title="最近订单"><List dataSource={recentOrders} renderItem={function (order) { return <List.Item><Space><Typography.Text strong>{order.orderNo}</Typography.Text><Tag>{order.status}</Tag></Space></List.Item>; }} /></Card></Col></Row></div>
  );
}
