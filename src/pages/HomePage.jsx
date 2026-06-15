import {
  ArrowUpOutlined,
  CustomerServiceOutlined,
  RightOutlined,
  SafetyCertificateOutlined,
  SwapOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { useMallData } from '../hooks/useMallData';
import { getBanners, getCategories, getHotProducts, getNewProducts } from '../utils/mallStore';

export default function HomePage() {
  const navigate = useNavigate();
  const banners = useMallData(function () { return getBanners(); }, []);
  const categories = useMallData(function () { return getCategories(); }, []);
  const hotProducts = useMallData(function () { return getHotProducts(8); }, []);
  const newProducts = useMallData(function () { return getNewProducts(8); }, []);
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(function () {
    function onScroll() {
      setShowBackTop(window.scrollY > 520);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return function () { window.removeEventListener('scroll', onScroll); };
  }, []);

  function searchProducts(keyword) {
    const params = keyword ? '?keyword=' + encodeURIComponent(keyword) : '';
    navigate('/category' + params);
  }

  return (
    <div className="hp">
      <section className="home-search-band">
        <div className="container">
          <SearchBar onSearch={searchProducts} placeholder="搜索手机、耳机、家居好物" />
        </div>
      </section>

      <HeroCarousel banners={banners} />

      <section className="hp-strip">
        <span><SafetyCertificateOutlined /> 正品保障</span>
        <span><SwapOutlined /> 7 天退换</span>
        <span><CustomerServiceOutlined /> 在线服务</span>
        <span><ThunderboltOutlined /> 快速发货</span>
      </section>

      <section className="shelf">
        <div className="shelf-header">
          <h2 className="shelf-title">按品类逛</h2>
          <span className="shelf-subtitle">从熟悉的场景开始挑选</span>
        </div>
        <div className="card-scroller">
          {categories.map(function (category) {
            return (
              <div className="card-scroller-item" key={category.id}>
                <a
                  className="ccard ccard-40"
                  href={'/category?category=' + category.id}
                  onClick={function (event) {
                    event.preventDefault();
                    navigate('/category?category=' + category.id);
                  }}
                >
                  <img className="ccard-image" alt={category.name} src={category.cover} />
                  <div className="ccard-content">
                    <div className="ccard-header">{category.name}</div>
                    <div className="ccard-desc">{category.description}</div>
                  </div>
                </a>
              </div>
            );
          })}
          <div className="card-scroller-item">
            <button className="ccard ccard-40 category-more-card" onClick={function () { navigate('/category'); }}>
              <span>全部分类</span>
              <RightOutlined />
            </button>
          </div>
        </div>
      </section>

      <section className="shelf">
        <div className="shelf-header shelf-header-row">
          <div>
            <h2 className="shelf-title">大家都在买</h2>
            <span className="shelf-subtitle">按销量精选的热门商品</span>
          </div>
          <a className="hp-hd-more" href="/category" onClick={function (event) { event.preventDefault(); navigate('/category'); }}>
            全部商品 <RightOutlined />
          </a>
        </div>
        <div className="product-strip">
          {hotProducts.map(function (product) {
            return <ProductCard key={product.id} product={product} />;
          })}
        </div>
      </section>

      <section className="shelf">
        <div className="shelf-header shelf-header-row">
          <div>
            <h2 className="shelf-title">新品上架</h2>
            <span className="shelf-subtitle">刚刚更新的灵感清单</span>
          </div>
          <a className="hp-hd-more" href="/category?sort=new" onClick={function (event) { event.preventDefault(); navigate('/category?sort=new'); }}>
            更多新品 <RightOutlined />
          </a>
        </div>
        <div className="product-strip">
          {newProducts.map(function (product) {
            return <ProductCard key={product.id} product={product} />;
          })}
        </div>
      </section>

      <section className="quicklinks">
        <h2 className="quicklinks-title">快速入口</h2>
        <div className="quicklinks-list">
          {['手机数码', '智能家居', '美妆护肤', '办公学习', '运动穿戴'].map(function (keyword) {
            return (
              <button className="quicklinks-btn" key={keyword} onClick={function () { navigate('/category?keyword=' + encodeURIComponent(keyword)); }}>
                {keyword}
              </button>
            );
          })}
        </div>
      </section>

      {showBackTop ? (
        <button className="back-top" onClick={function () { window.scrollTo({ top: 0, behavior: 'smooth' }); }} aria-label="返回顶部">
          <ArrowUpOutlined />
        </button>
      ) : null}
    </div>
  );
}
