import { Button, Card, Descriptions, Empty, List, Radio, Space, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMallData } from '../hooks/useMallData';
import { useUser } from '../contexts/UserContext';
import { formatPrice } from '../utils/formatters';
import { createOrder, getAddresses, getCheckoutDraft, getDefaultAddress } from '../utils/mallStore';

// 创建订单页统一处理购物车结算和立即购买两种场景。
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const draft = useMallData(function () { return getCheckoutDraft(); }, []);
  const addresses = useMallData(function () { return user ? getAddresses(user.id) : []; }, [user?.id]);
  const [selectedAddressId, setSelectedAddressId] = useState('');

  useEffect(function () { const address = user ? getDefaultAddress(user.id) : null; setSelectedAddressId(address?.id || ''); }, [user, addresses]);
  if (!draft?.items?.length) return <Card className="section-card"><Empty description="暂无待提交订单，请从购物车或商品详情发起购买"><Button type="primary" onClick={function () { navigate('/'); }}>返回首页</Button></Empty></Card>;

  const totalAmount = draft.items.reduce(function (sum, item) { return sum + item.product.price * item.quantity; }, 0);

  return (
    <div className="page-section-stack">
      <Card className="section-card">
        <Typography.Title level={3}>选择收货地址</Typography.Title>
        <Radio.Group className="address-radio-group" value={selectedAddressId} onChange={function (event) { setSelectedAddressId(event.target.value); }}>
          <Space direction="vertical" style={{ width: '100%' }}>{addresses.map(function (address) { return <Card className="address-card" key={address.id}><Radio value={address.id}><Space direction="vertical" size={4}><Typography.Text strong>{address.receiver} {address.phone}</Typography.Text><Typography.Text>{address.region + ' ' + address.detail}</Typography.Text><Typography.Text type="secondary">{address.tag}</Typography.Text></Space></Radio></Card>; })}</Space>
        </Radio.Group>
      </Card>
      <Card className="section-card">
        <Typography.Title level={3}>确认商品清单</Typography.Title>
        <List dataSource={draft.items} itemLayout="horizontal" renderItem={function (item) { return <List.Item><List.Item.Meta avatar={<img alt={item.product.name} className="table-thumb" src={item.product.cover} />} description={item.spec} title={item.product.name} /><Space><Typography.Text>x {item.quantity}</Typography.Text><Typography.Text strong>{formatPrice(item.product.price * item.quantity)}</Typography.Text></Space></List.Item>; }} />
        <Descriptions bordered column={1} size="small"><Descriptions.Item label="订单来源">{draft.source === 'cart' ? '购物车结算' : '立即购买'}</Descriptions.Item><Descriptions.Item label="订单总额">{formatPrice(totalAmount)}</Descriptions.Item></Descriptions>
      </Card>
      <Card className="section-card"><div className="checkout-bar"><Typography.Text strong className="price-text">应付总额：{formatPrice(totalAmount)}</Typography.Text><Button type="primary" onClick={function () { if (!selectedAddressId) { message.warning('请选择收货地址'); return; } const order = createOrder({ userId: user.id, addressId: selectedAddressId, items: draft.items, source: draft.source }); message.success('订单提交成功'); navigate('/pay/' + order.id); }}>提交订单</Button></div></Card>
    </div>
  );
}
