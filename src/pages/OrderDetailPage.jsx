import { Button, Card, Descriptions, List, Space, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import OrderStatusTag from '../components/OrderStatusTag';
import { useMallData } from '../hooks/useMallData';
import { formatPrice } from '../utils/formatters';
import { getOrderById } from '../utils/mallStore';

// 订单详情页展示订单信息、状态、地址与商品清单。
export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = useMallData(function () { return getOrderById(id); }, [id]);
  if (!order) return <Card className="section-card">订单不存在。</Card>;

  return (
    <div className="page-section-stack">
      <Card className="section-card">
        <div className="section-header"><Typography.Title level={3}>订单详情</Typography.Title><Space><OrderStatusTag status={order.status} />{order.status === '待付款' ? <Button type="primary" onClick={function () { navigate('/pay/' + order.id); }}>去支付</Button> : null}</Space></div>
        <Descriptions bordered column={2}><Descriptions.Item label="订单编号">{order.orderNo}</Descriptions.Item><Descriptions.Item label="订单状态">{order.status}</Descriptions.Item><Descriptions.Item label="下单时间">{order.createdAt}</Descriptions.Item><Descriptions.Item label="订单来源">{order.source === 'cart' ? '购物车结算' : '立即购买'}</Descriptions.Item><Descriptions.Item label="收货人">{order.address?.receiver || '--'}</Descriptions.Item><Descriptions.Item label="联系方式">{order.address?.phone || '--'}</Descriptions.Item><Descriptions.Item label="收货地址" span={2}>{order.address ? order.address.region + ' ' + order.address.detail : '--'}</Descriptions.Item></Descriptions>
      </Card>
      <Card className="section-card"><Typography.Title level={4}>商品列表</Typography.Title><List dataSource={order.items} renderItem={function (item) { return <List.Item><List.Item.Meta avatar={<img alt={item.productName} className="table-thumb" src={item.cover} />} description={item.spec} title={item.productName} /><Space><Typography.Text>x {item.quantity}</Typography.Text><Typography.Text strong>{formatPrice(item.price * item.quantity)}</Typography.Text></Space></List.Item>; }} /><div className="order-summary">订单总金额：{formatPrice(order.totalAmount)}</div></Card>
    </div>
  );
}
