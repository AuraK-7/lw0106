import {
  ArrowUpOutlined,
  CustomerServiceOutlined,
  RightOutlined,
  SafetyCertificateOutlined,
  SwapOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { useMallData } from '../hooks/useMallData';
import { getBanners, getCategories, getHotProducts, getNewProducts } from '../utils/mallStore';

const SUBCATEGORY_MAP = {
  cat_phone: ['手机', '平板', '耳机', '相机', '数码配件'],
  cat_home: ['空气净化器', '扫拖机器人', '智能家居', '清洁电器', '居家好物'],
  cat_beauty: ['精华', '彩妆', '护肤', '礼盒', '持妆'],
  cat_office: ['键盘', '会议耳机', '办公', '学习', '桌面装备'],
  cat_wear: ['运动手表', '运动耳机', '穿戴设备', '健康监测', '运动装备'],
};

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const hotShelfRef = useRef(null);
  const newShelfRef = useRef(null);
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

  useEffect(function () {
    if (!location.state?.focusSearch) return;
    scrollToSearch();
    navigate('.', { replace: true, state: {} });
  }, [location.state, navigate]);

  function scrollToSearch() {
    searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function scrollToHotProducts() {
    hotShelfRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function scrollToNewProducts() {
    newShelfRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleSearch(keyword = '') {
    const nextKeyword = keyword.trim();
    if (!nextKeyword) return;
    navigate('/search?keyword=' + encodeURIComponent(nextKeyword));
  }

  function openActivity(categoryId) {
    navigate('/activity/' + categoryId);
  }

  return (
    <div className="hp">
      <section className="home-search-band" ref={searchRef}>
        <div className="container">
          <SearchBar onSearch={handleSearch} placeholder="搜索手机、耳机、家居好物" />
          <div className="home-category-tags" aria-label="商品分类快捷入口">
            <button className="home-category-tag" onClick={scrollToHotProducts}>全部分类</button>
            {categories.map(function (category) {
              return (
                <button className="home-category-tag" key={category.id} onClick={scrollToHotProducts}>
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="home-market-layout">
        <aside className="home-category-panel" aria-label="商品分类">
          <h2>分类</h2>
          <div className="home-category-list">
            {categories.map(function (category) {
              return (
                <div className="home-category-item" key={category.id}>
                  <button className="home-category-row" onClick={function () { handleSearch(category.name); }}>
                    <span>{category.name}</span>
                    <small>{category.description}</small>
                    <RightOutlined />
                  </button>
                  <div className="home-category-flyout">
                    <div className="home-category-flyout-head">
                      <strong>{category.name}</strong>
                      <span>选择更细分类查看商品</span>
                    </div>
                    <div className="home-subcategory-grid">
                      {(SUBCATEGORY_MAP[category.id] || [category.name]).map(function (keyword) {
                        return (
                          <button key={keyword} onClick={function (event) { event.stopPropagation(); handleSearch(keyword); }}>
                            {keyword}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        <HeroCarousel banners={banners} onShopNow={scrollToHotProducts} />

        <aside className="home-promo-stack" aria-label="精选活动">
          {categories.slice(0, 4).map(function (category) {
            return (
              <button className="home-promo-card" key={category.id} onClick={function () { openActivity(category.id); }}>
                <span>{category.name}</span>
                <strong>进入专属活动 <RightOutlined /></strong>
                <img alt="" src={category.cover} />
              </button>
            );
          })}
        </aside>
      </section>

      <section className="hp-strip">
        <span><SafetyCertificateOutlined /> 正品保障</span>
        <span><SwapOutlined /> 7 天退换</span>
        <span><CustomerServiceOutlined /> 在线服务</span>
        <span><ThunderboltOutlined /> 快速发货</span>
      </section>

      <section className="shelf" ref={hotShelfRef}>
        <div className="shelf-header shelf-header-row">
          <div>
            <h2 className="shelf-title">大家都在买</h2>
            <span className="shelf-subtitle">按销量精选的热门商品</span>
          </div>
          <button className="hp-hd-more hp-hd-button" onClick={scrollToHotProducts}>
            全部商品 <RightOutlined />
          </button>
        </div>
        <div className="product-strip">
          {hotProducts.map(function (product) {
            return <ProductCard key={product.id} product={product} />;
          })}
        </div>
      </section>

      <section className="shelf" ref={newShelfRef}>
        <div className="shelf-header shelf-header-row">
          <div>
            <h2 className="shelf-title">新品上架</h2>
            <span className="shelf-subtitle">刚刚更新的灵感清单</span>
          </div>
          <button className="hp-hd-more hp-hd-button" onClick={scrollToNewProducts}>
            更多新品 <RightOutlined />
          </button>
        </div>
        <div className="product-strip">
          {newProducts.map(function (product) {
            return <ProductCard key={product.id} product={product} />;
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
