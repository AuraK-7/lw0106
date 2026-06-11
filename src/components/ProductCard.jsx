import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  return (
    <div className="pcard" onClick={function () { navigate('/product/' + product.id); }} role="link" tabIndex={0}
      onKeyDown={function (e) { if (e.key === 'Enter') navigate('/product/' + product.id); }}>
      <div className="pcard-img-wrap">
        <img alt={product.name} className="pcard-image" src={product.cover} />
      </div>
      <div className="pcard-body">
        <div className="pcard-name">{product.name}</div>
        <div className="pcard-price-row">
          <span className="pcard-price">¥{product.price}</span>
        </div>
      </div>
    </div>
  );
}
