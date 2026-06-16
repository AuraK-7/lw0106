import { ShoppingCartOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Divider, InputNumber, message, Radio, Space, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useMallData } from '../hooks/useMallData';
import { formatPrice } from '../utils/formatters';
import { addCartItem, generateId, getProductById, getSpecInfo, setCheckoutDraft } from '../utils/mallStore';

// ---- 从 specs 数组中提取展示用的名称列表（兼容新旧格式） ----
function getSpecNames(specs) {
  if (!Array.isArray(specs)) return [];
  if (typeof specs[0] === 'object') return specs.map(function (s) { return s.name; });
  return specs;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const product = useMallData(function () { return getProductById(id); }, [id]);
  const [selectedSpec, setSelectedSpec] = useState('');
  const [quantity, setQuantity] = useState(1);

  // ---- 当前规格的价格/库存（兼容旧格式） ----
  const specInfo = getSpecInfo(product, selectedSpec);
  const currentPrice = specInfo.price;
  const currentMarketPrice = specInfo.marketPrice;
  const currentStock = specInfo.stock;
  const soldOut = currentStock <= 0;

  useEffect(function () {
    if (!product) return;
    const names = getSpecNames(product.specs);
    setSelectedSpec(names[0] || '');
    const firstSpec = getSpecInfo(product, names[0] || '');
    setQuantity(firstSpec.stock > 0 ? 1 : 0);
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
    if (quantity === null || quantity === undefined || quantity === '') {
      message.warning('请输入购买数量');
      return false;
    }
    const num = Number(quantity);
    if (!Number.isInteger(num)) {
      message.warning('购买数量必须是整数');
      return false;
    }
    if (num <= 0) {
      message.warning('购买数量必须大于 0');
      return false;
    }
    if (num > currentStock) {
      message.warning('库存不足，当前最多可购买 ' + currentStock + ' 件');
      return false;
    }
    return true;
  }

  function handleAddCart() {
    if (!ensureLogin() || !validateQuantity()) return;
    try {
      addCartItem({ userId: user.id, productId: product.id, spec: selectedSpec, quantity });
      message.success('已加入购物车');
    } catch (error) {
      message.warning(error.message || '加入购物车失败');
    }
  }

  function handleBuyNow() {
    if (!ensureLogin() || !validateQuantity()) return;
    setCheckoutDraft({
      source: 'direct',
      items: [{
        id: generateId('draft'),
        userId: user.id,
        productId: product.id,
        spec: selectedSpec,
        specPrice: currentPrice,
        quantity,
        product,
      }],
    });
    navigate('/checkout');
  }

  const specNames = getSpecNames(product.specs);

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
              <Typography.Text className="price-text large-price">{formatPrice(currentPrice)}</Typography.Text>
              <Typography.Text delete type="secondary">{formatPrice(currentMarketPrice)}</Typography.Text>
            </div>

            {specNames.length > 0 && (
              <div>
                <Typography.Text strong>规格选择</Typography.Text>
                <Radio.Group
                  className="spec-group"
                  optionType="button"
                  options={specNames.map(function (item) { return { label: item, value: item }; })}
                  value={selectedSpec}
                  onChange={function (event) {
                    const newSpec = event.target.value;
                    setSelectedSpec(newSpec);
                    const newInfo = getSpecInfo(product, newSpec);
                    setQuantity(newInfo.stock > 0 ? 1 : 0);
                  }}
                />
              </div>
            )}

            <div>
              <Typography.Text strong>购买数量</Typography.Text>
              <div className="qty-wrap">
                <InputNumber
                  value={quantity}
                  disabled={soldOut}
                  onChange={function (value) { setQuantity(value); }}
                />
                <Typography.Text type={soldOut ? 'danger' : 'secondary'}>
                  库存：{currentStock}{soldOut ? '（已售罄）' : ''}
                </Typography.Text>
              </div>
            </div>

            <Space size="middle" wrap>
              <Button size="large" icon={<ShoppingCartOutlined />} onClick={handleAddCart} disabled={soldOut || !product.published}>
                加入购物车
              </Button>
              <Button size="large" type="primary" icon={<ThunderboltOutlined />} onClick={handleBuyNow} disabled={soldOut || !product.published}>
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
