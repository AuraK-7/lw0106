import { ShoppingOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/formatters';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const discount = product.marketPrice > product.price
    ? Math.round((1 - product.price / product.marketPrice) * 10)
    : 0;

  function openDetail() {
    navigate('/product/' + product.id);
  }

  return (
    <article
      className="pcard"
      onClick={openDetail}
      role="link"
      tabIndex={0}
      onKeyDown={function (event) { if (event.key === 'Enter') openDetail(); }}
    >
      <div className="pcard-img-wrap">
        <img alt={product.name} className="pcard-image" src={product.cover} />
        {product.tags?.[0] ? <span className="pcard-float-tag">{product.tags[0]}</span> : null}
      </div>
      <div className="pcard-body">
        <div className="pcard-meta">
          <Tag>{product.categoryName}</Tag>
          {discount > 0 ? <Tag color="red">{discount} 折</Tag> : null}
        </div>
        <h3 className="pcard-name">{product.name}</h3>
        <p className="pcard-desc">{product.description}</p>
        <div className="pcard-price-row">
          <span className="pcard-price">{formatPrice(product.price)}</span>
          <span className="pcard-sales"><ShoppingOutlined /> 已售 {product.sales}</span>
        </div>
      </div>
    </article>
  );
}
