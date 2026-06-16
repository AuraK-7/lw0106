import { Button, Card, Empty, InputNumber, Popconfirm, Space, Table, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { formatPrice } from '../utils/formatters';
import { removeCartItems, setCheckoutDraft, updateCartItem, getSpecInfo } from '../utils/mallStore';

// 购物车页支持数量调整、单条删除、批量删除与结算。
export default function CartPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { cartItems, checkedItems, totalAmount } = useCart();
  if (!cartItems.length) return <Card className="section-card"><Empty description="购物车还是空的，去首页挑选心仪商品吧"><Button type="primary" onClick={function () { navigate('/'); }}>返回首页</Button></Empty></Card>;

  const selectedRowKeys = checkedItems.map(function (item) { return item.id; });
  const columns = [
    { title: '商品', dataIndex: 'product', render(product, record) { return <Space><img alt={product.name} className="table-thumb" src={product.cover} /><div><Typography.Text strong>{product.name}</Typography.Text><div className="muted-text">{record.spec}</div></div></Space>; } },
    { title: '单价', dataIndex: 'product', render(product, record) { return formatPrice(record.specPrice || product.price); } },
    { title: '数量', dataIndex: 'quantity', render(quantity, record) { return <InputNumber min={0} value={quantity} onChange={function (value) { const nextValue = Number(value); if (nextValue === 0) { message.warning('商品数量必须大于0'); updateCartItem(record.id, { quantity: 1 }); return; } if (nextValue > record.product.stock) { message.warning('库存不足，已自动调整为最大库存'); updateCartItem(record.id, { quantity: record.product.stock }); return; } updateCartItem(record.id, { quantity: value }); }} />; } },
    { title: '小计', dataIndex: 'amount', render(amount) { return <Typography.Text strong>{formatPrice(amount)}</Typography.Text>; } },
    { title: '操作', render(_, record) { return <Popconfirm title="确认删除该商品吗？" onConfirm={function () { removeCartItems([record.id]); }}><Button danger type="link">删除</Button></Popconfirm>; } },
  ];

  return (
    <div className="page-section-stack">
      <Card className="section-card"><Table columns={columns} dataSource={cartItems} pagination={false} rowKey="id" rowSelection={{ selectedRowKeys, onChange(nextKeys) { cartItems.forEach(function (item) { updateCartItem(item.id, { checked: nextKeys.includes(item.id) }); }); } }} /></Card>
      <Card className="section-card"><div className="checkout-bar"><Space><Button danger onClick={function () { if (!selectedRowKeys.length) { message.warning('请先勾选需要删除的商品'); return; } removeCartItems(selectedRowKeys); }}>删除选中</Button></Space><Space size="large"><Typography.Text>已选商品：{checkedItems.length} 件</Typography.Text><Typography.Text strong className="price-text">合计：{formatPrice(totalAmount)}</Typography.Text><Button type="primary" onClick={function () { if (!checkedItems.length) { message.warning('请先勾选需要结算的商品'); return; } for (var ci = 0; ci < checkedItems.length; ci++) { var ciItem = checkedItems[ci]; var ciProduct = ciItem.product; var ciSpecInfo = getSpecInfo(ciProduct, ciItem.spec); if (!ciProduct || !ciProduct.published) { message.warning('商品「' + (ciProduct ? ciProduct.name : '未知') + '」已下架，无法结算'); return; } if (!ciItem.quantity || ciItem.quantity <= 0) { message.warning('商品「' + ciProduct.name + '」数量无效，无法结算'); return; } if (ciItem.quantity > ciSpecInfo.stock) { message.warning('商品「' + ciProduct.name + '」当前规格「' + ciItem.spec + '」库存不足，最多可购买 ' + ciSpecInfo.stock + ' 件'); return; } } setCheckoutDraft({ source: 'cart', userId: user.id, items: checkedItems }); navigate('/checkout'); }}>选中商品结算</Button></Space></div></Card>
    </div>
  );
}
