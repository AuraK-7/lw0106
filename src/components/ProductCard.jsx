import { Card, Space, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/formatters';

const { Paragraph, Text } = Typography;

// 商品卡片组件，前台列表和首页复用。
export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <Card hoverable className="product-card" cover={<img alt={product.name} className="product-cover" src={product.cover} />} onClick={function () { navigate('/product/' + product.id); }}>
      <Space wrap size={[8, 8]}>
        {product.tags.map(function (tag) {
          return <Tag color="blue" key={tag}>{tag}</Tag>;
        })}
      </Space>
      <Typography.Title level={5}>{product.name}</Typography.Title>
      <Paragraph ellipsis={{ rows: 2 }} type="secondary">{product.description}</Paragraph>
      <div className="product-card-footer">
        <div>
          <Text className="price-text">{formatPrice(product.price)}</Text>
          <Text delete type="secondary">{formatPrice(product.marketPrice)}</Text>
        </div>
        <Text type="secondary">销量 {product.sales}</Text>
      </div>
    </Card>
  );
}
