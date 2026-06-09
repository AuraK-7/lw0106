import { AlipayCircleOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Result, Space, Typography, message } from 'antd';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMallData } from '../hooks/useMallData';
import { formatPrice } from '../utils/formatters';
import { getOrderById, payOrder } from '../utils/mallStore';

// 支付页模拟支付宝支付流程。
export default function PayPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);
  const order = useMallData(function () { return getOrderById(id); }, [id]);
  if (!order) return <Result status="404" subTitle="当前订单不存在。" title="订单未找到" />;
  if (order.status !== '待付款') return <Result status="success" subTitle="该订单已经完成支付或进入后续流程。" title="无需重复支付" extra={[<Button key="detail" type="primary" onClick={function () { navigate('/order/' + order.id); }}>查看订单详情</Button>]} />;

  return (
    <Card className="section-card pay-card">
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        <Typography.Title level={2}>模拟支付宝支付</Typography.Title>
        <Descriptions bordered column={1}><Descriptions.Item label="订单编号">{order.orderNo}</Descriptions.Item><Descriptions.Item label="应付金额">{formatPrice(order.totalAmount)}</Descriptions.Item><Descriptions.Item label="商品数量">{order.itemCount}</Descriptions.Item></Descriptions>
        <div className="pay-panel"><AlipayCircleOutlined className="pay-icon" /><Typography.Text>点击下方按钮模拟完成支付</Typography.Text><Button loading={paying} size="large" type="primary" onClick={async function () { setPaying(true); await new Promise(function (resolve) { window.setTimeout(resolve, 1200); }); payOrder(order.id); setPaying(false); message.success('支付成功，订单进入待发货状态'); navigate('/order/' + order.id); }}>立即支付</Button></div>
      </Space>
    </Card>
  );
}
