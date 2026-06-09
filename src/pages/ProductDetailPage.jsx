import { Button, Card, Col, Descriptions, Divider, InputNumber, message, Radio, Row, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMallData } from '../hooks/useMallData';
import { useUser } from '../contexts/UserContext';
import { formatPrice } from '../utils/formatters';
import { addCartItem, generateId, getProductById, setCheckoutDraft } from '../utils/mallStore';

// 商品详情页支持规格选择、加入购物车与立即购买。
export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const product = useMallData(function () { return getProductById(id); }, [id]);
  const [selectedSpec, setSelectedSpec] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(function () { setSelectedSpec(product?.specs?.[0] || ''); setQuantity(1); }, [product]);
  if (!product) return <Card className="section-card">商品不存在或已被删除。</Card>;

  function ensureLogin() {
    if (!user) { navigate('/login', { state: { from: location } }); return false; }
    return true;
  }

  function handleAddCart() {
    if (!ensureLogin()) return;
    addCartItem({ userId: user.id, productId: product.id, spec: selectedSpec, quantity });
    message.success('已加入购物车');
  }

  function handleBuyNow() {
    if (!ensureLogin()) return;
    setCheckoutDraft({ source: 'direct', items: [{ id: generateId('draft'), userId: user.id, productId: product.id, spec: selectedSpec, quantity, product }] });
    navigate('/checkout');
  }

  return (
    <Card className="section-card">
      <Row gutter={[24, 24]}>
        <Col lg={10} xs={24}><img alt={product.name} className="detail-image" src={product.cover} /></Col>
        <Col lg={14} xs={24}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Typography.Title level={2}>{product.name}</Typography.Title>
            <Typography.Paragraph type="secondary">{product.description}</Typography.Paragraph>
            <div className="price-panel"><Typography.Text className="price-text large-price">{formatPrice(product.price)}</Typography.Text><Typography.Text delete type="secondary">{formatPrice(product.marketPrice)}</Typography.Text></div>
            <div>
              <Typography.Text strong>规格选择</Typography.Text>
              <Radio.Group className="spec-group" optionType="button" options={product.specs.map(function (item) { return { label: item, value: item }; })} value={selectedSpec} onChange={function (event) { setSelectedSpec(event.target.value); }} />
            </div>
            <div>
              <Typography.Text strong>购买数量</Typography.Text>
              <div className="qty-wrap"><InputNumber max={product.stock} min={1} value={quantity} onChange={setQuantity} /><Typography.Text type="secondary">库存：{product.stock}</Typography.Text></div>
            </div>
            <Space size="large"><Button size="large" onClick={handleAddCart}>加入购物车</Button><Button size="large" type="primary" onClick={handleBuyNow}>立即购买</Button></Space>
            <Divider />
            <Descriptions bordered column={1} size="small"><Descriptions.Item label="所属分类">{product.categoryName}</Descriptions.Item><Descriptions.Item label="销量">{product.sales}</Descriptions.Item><Descriptions.Item label="商品详情">{product.detail}</Descriptions.Item></Descriptions>
          </Space>
        </Col>
      </Row>
    </Card>
  );
}
