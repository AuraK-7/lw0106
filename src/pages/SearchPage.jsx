import { ArrowLeftOutlined } from '@ant-design/icons';
import { Empty } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { getProducts } from '../utils/mallStore';

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const products = getProducts({ keyword, pageSize: 48 }).all;

  function handleSearch(nextKeyword = '') {
    const value = nextKeyword.trim();
    if (!value) return;
    setSearchParams({ keyword: value });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <main className="search-page">
      <section className="search-page-head">
        <button className="search-back" onClick={function () { navigate('/'); }}>
          <ArrowLeftOutlined /> 返回首页
        </button>
        <div className="search-page-bar">
          <SearchBar defaultValue={keyword} onSearch={handleSearch} placeholder="搜索手机、耳机、家居好物" />
        </div>
      </section>

      <section className="search-result-panel">
        {products.length ? (
          <div className="product-grid search-product-grid">
            {products.map(function (product) {
              return <ProductCard key={product.id} product={product} />;
            })}
          </div>
        ) : (
          <div className="search-empty">
            <Empty description="没有找到相关商品，换个关键词试试" />
          </div>
        )}
      </section>
    </main>
  );
}
