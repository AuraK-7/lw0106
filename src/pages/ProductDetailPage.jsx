import { ShoppingCartOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Divider, InputNumber, message, Radio, Space, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useMallData } from '../hooks/useMallData';
import { formatPrice } from '../utils/formatters';
import { addCartItem, generateId, getProductById, setCheckoutDraft } from '../utils/mallStore';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const product = useMallData(function () { return getProductById(id); }, [id]);
  const [selectedSpec, setSelectedSpec] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(function () {
    setSelectedSpec(product?.specs?.[0] || '');
    setQuantity(1);
  }, [product]);

  if (!product) {
    return (
      <Card className="section-card">
        <Typography.Title level={3}>商品不存在或已被删除</Typography.Title>
        <Button onClick={function () { navigate('/category'); }}>返回商品分类</Button>
      </Card>
    );
  }

  function ensureLogin() {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return false;
    }
    return true;
  }

  function validateQuantity() {
    if (quantity <= 0) {
      message.warning('购买数量必须大于 0');
      return false;
    }
    if (quantity > product.stock) {
      message.warning('库存不足，无法下单');
      return false;
    }
    return true;
  }

  function handleAddCart() {
    if (!ensureLogin() || !validateQuantity()) return;
    addCartItem({ userId: user.id, productId: product.id, spec: selectedSpec, quantity });
    message.success('已加入购物车');
  }

  function handleBuyNow() {
    if (!ensureLogin() || !validateQuantity()) return;
    setCheckoutDraft({
      source: 'direct',
      items: [{ id: generateId('draft'), userId: user.id, productId: product.id, spec: selectedSpec, quantity, product }],
    });
    navigate('/checkout');
  }

  return (
    <div className="detail-page">
      <button className="detail-back" onClick={function () { navigate(-1); }}>返回</button>
      <section className="detail-shell">
        <div className="detail-media">
          <img alt={product.name} className="detail-image" src={product.cover} />
        </div>
        <div className="detail-info">
          <Space direction="vertical" size={18} style={{ width: '100%' }}>
            <div>
              <Space wrap>
                <Tag color={product.published ? 'blue' : 'default'}>{product.published ? '正在售卖' : '暂未上架'}</Tag>
                {product.tags?.map(function (tag) { return <Tag key={tag}>{tag}</Tag>; })}
              </Space>
              <Typography.Title level={2}>{product.name}</Typography.Title>
              <Typography.Paragraph type="secondary">{product.description}</Typography.Paragraph>
            </div>

            <div className="price-panel">
              <Typography.Text className="price-text large-price">{formatPrice(product.price)}</Typography.Text>
              <Typography.Text delete type="secondary">{formatPrice(product.marketPrice)}</Typography.Text>
            </div>

            <div>
              <Typography.Text strong>规格选择</Typography.Text>
              <Radio.Group
                className="spec-group"
                optionType="button"
                options={product.specs.map(function (item) { return { label: item, value: item }; })}
                value={selectedSpec}
                onChange={function (event) { setSelectedSpec(event.target.value); }}
              />
            </div>

            <div>
              <Typography.Text strong>购买数量</Typography.Text>
              <div className="qty-wrap">
                <InputNumber min={1} max={product.stock} value={quantity} onChange={function (value) { setQuantity(value || 1); }} />
                <Typography.Text type="secondary">库存：{product.stock}</Typography.Text>
              </div>
            </div>

            <Space size="middle" wrap>
              <Button size="large" icon={<ShoppingCartOutlined />} onClick={handleAddCart} disabled={!product.published}>
                加入购物车
              </Button>
              <Button size="large" type="primary" icon={<ThunderboltOutlined />} onClick={handleBuyNow} disabled={!product.published}>
                立即购买
              </Button>
            </Space>

            <Divider />
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="所属分类">{product.categoryName}</Descriptions.Item>
              <Descriptions.Item label="累计销量">{product.sales}</Descriptions.Item>
              <Descriptions.Item label="商品详情">{product.detail}</Descriptions.Item>
            </Descriptions>
          </Space>
        </div>
      </section>
    </div>
  );
}
