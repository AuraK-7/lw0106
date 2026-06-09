import { Button, Card, Col, Empty, List, Pagination, Popconfirm, Row, Space, Tabs, Typography, message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useMallData } from '../hooks/useMallData';
import { formatPrice } from '../utils/formatters';
import { deleteAddress, getAddresses, getOrders, saveAddress, setDefaultAddress } from '../utils/mallStore';

function AddressEditor({ editingAddress, onCancel, onSubmit }) {
  const [receiver, setReceiver] = useState(editingAddress?.receiver || '');
  const [phone, setPhone] = useState(editingAddress?.phone || '');
  const [region, setRegion] = useState(editingAddress?.region || '');
  const [detail, setDetail] = useState(editingAddress?.detail || '');
  const [tag, setTag] = useState(editingAddress?.tag || '');
  const [isDefault, setIsDefault] = useState(Boolean(editingAddress?.isDefault));
  return (
    <Card className="section-card">
      <Typography.Title level={4}>{editingAddress ? '编辑地址' : '新增地址'}</Typography.Title>
      <div className="simple-form-grid">
        <input className="simple-input" placeholder="收货人" value={receiver} onChange={function (event) { setReceiver(event.target.value); }} />
        <input className="simple-input" placeholder="手机号" value={phone} onChange={function (event) { setPhone(event.target.value); }} />
        <input className="simple-input" placeholder="省市区" value={region} onChange={function (event) { setRegion(event.target.value); }} />
        <input className="simple-input" placeholder="详细地址" value={detail} onChange={function (event) { setDetail(event.target.value); }} />
        <input className="simple-input" placeholder="地址标签" value={tag} onChange={function (event) { setTag(event.target.value); }} />
        <label className="simple-checkbox"><input checked={isDefault} type="checkbox" onChange={function (event) { setIsDefault(event.target.checked); }} />设为默认地址</label>
      </div>
      <Space><Button onClick={onCancel}>取消</Button><Button type="primary" onClick={function () { if (!receiver || !phone || !region || !detail || !tag) { message.warning('请完整填写地址信息'); return; } if (!/^1\d{10}$/.test(phone)) { message.warning('请输入正确手机号'); return; } onSubmit({ receiver, phone, region, detail, tag, isDefault }); }}>保存地址</Button></Space>
    </Card>
  );
}

// 我的页面负责展示用户信息、订单分类和地址管理。
export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [tabKey, setTabKey] = useState('all');
  const [page, setPage] = useState(1);
  const [editingAddress, setEditingAddress] = useState(undefined);
  const [editingOpen, setEditingOpen] = useState(false);
  const ordersResult = useMallData(function () { const statusMap = { all: 'all', pay: '待付款', receipt: '待收货分组' }; return getOrders({ userId: user.id, status: statusMap[tabKey], page, pageSize: 4 }); }, [user.id, tabKey, page]);
  const addresses = useMallData(function () { return getAddresses(user.id); }, [user.id]);

  return (
    <div className="page-section-stack">
      <Row gutter={[16, 16]}>
        <Col lg={8} xs={24}><Card className="section-card"><Typography.Title level={3}>个人中心</Typography.Title><Space direction="vertical" size={8}><Typography.Text>用户名：{user.username}</Typography.Text><Typography.Text>昵称：{user.nickname}</Typography.Text><Typography.Text>手机号：{user.phone}</Typography.Text><Typography.Text>注册时间：{user.createdAt}</Typography.Text></Space></Card></Col>
        <Col lg={16} xs={24}><Card className="section-card"><Tabs activeKey={tabKey} items={[{ key: 'all', label: '全部订单' }, { key: 'pay', label: '待付款' }, { key: 'receipt', label: '待收货' }]} onChange={function (key) { setTabKey(key); setPage(1); }} />{ordersResult.list.length ? <><List dataSource={ordersResult.list} renderItem={function (order) { return <List.Item actions={[<Button key="detail" type="link" onClick={function () { navigate('/order/' + order.id); }}>查看详情</Button>, order.status === '待付款' ? <Button key="pay" type="link" onClick={function () { navigate('/pay/' + order.id); }}>去支付</Button> : null]}><List.Item.Meta description={'下单时间：' + order.createdAt} title={<Space><Typography.Text strong>{order.orderNo}</Typography.Text><span className="mini-status">{order.status}</span></Space>} /><Typography.Text strong>{formatPrice(order.totalAmount)}</Typography.Text></List.Item>; }} /><div className="pagination-wrap"><Pagination current={page} pageSize={4} total={ordersResult.total} onChange={function (nextPage) { setPage(nextPage); }} /></div></> : <Empty description="当前分类暂无订单" />}</Card></Col>
      </Row>
      <Card className="section-card"><div className="section-header"><div><Typography.Title level={3}>收货地址管理</Typography.Title><Typography.Text type="secondary">支持新增、编辑、删除与设置默认地址</Typography.Text></div><Button type="primary" onClick={function () { setEditingAddress(undefined); setEditingOpen(true); }}>新增地址</Button></div><Row gutter={[16, 16]}>{addresses.map(function (address) { return <Col key={address.id} lg={12} xs={24}><Card className="address-card"><Space direction="vertical" size={6}><Space><Typography.Text strong>{address.receiver}</Typography.Text><Typography.Text>{address.phone}</Typography.Text>{address.isDefault ? <Button size="small" type="primary">默认地址</Button> : null}</Space><Typography.Text>{address.region + ' ' + address.detail}</Typography.Text><Typography.Text type="secondary">{address.tag}</Typography.Text><Space>{!address.isDefault ? <Button type="link" onClick={function () { setDefaultAddress(user.id, address.id); message.success('已设置为默认地址'); }}>设为默认</Button> : null}<Button type="link" onClick={function () { setEditingAddress(address); setEditingOpen(true); }}>编辑</Button><Popconfirm title="确认删除该地址吗？" onConfirm={function () { deleteAddress(address.id); message.success('地址已删除'); }}><Button danger type="link">删除</Button></Popconfirm></Space></Space></Card></Col>; })}</Row></Card>
      {editingOpen ? <AddressEditor editingAddress={editingAddress} onCancel={function () { setEditingOpen(false); setEditingAddress(undefined); }} onSubmit={function (values) { saveAddress({ ...editingAddress, ...values, userId: user.id }); message.success(editingAddress ? '地址修改成功' : '地址新增成功'); setEditingOpen(false); setEditingAddress(undefined); }} /> : null}
    </div>
  );
}
