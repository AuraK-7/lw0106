import {
  ArrowLeftOutlined,
  FireOutlined,
  RightOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Button, Empty, message } from 'antd';
import { useMemo, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useMallData } from '../hooks/useMallData';
import { formatPrice } from '../utils/formatters';
import {
  claimActivityCoupons,
  claimCoupon,
  getActivityCoupons,
  getCategories,
  getCategoryById,
  getProducts,
} from '../utils/mallStore';

const ACTIVITY_COPY = {
  cat_phone: {
    theme: 'phone',
    tag: '618 主会场',
    title: '数码装备 旗舰好物直降',
    subtitle: '手机、平板、耳机与影像设备限时精选',
    search: '手机',
    navs: ['爆款直降', '新品尝鲜', '配件精选', '影音设备', '学习办公'],
  },
  cat_home: {
    theme: 'home',
    tag: '品质生活节',
    title: '智能家居 舒适生活会场',
    subtitle: '清洁、净化、氛围与家用设备一站挑选',
    search: '空气净化器',
    navs: ['清洁好物', '居家氛围', '智能设备', '品质家电', '为你推荐'],
    coupons: [
      { amount: '¥300', limit: '满 3000 可用' },
      { amount: '¥150', limit: '满 1500 可用' },
      { amount: '¥80', limit: '满 800 可用' },
      { amount: '¥30', limit: '满 300 可用' },
    ],
  },
  cat_beauty: {
    theme: 'beauty',
    tag: '夏日护理节',
    title: '美妆护肤 焕亮日常',
    subtitle: '护肤礼盒、彩妆盘与日常护理好物精选',
    search: '精华',
    navs: ['大额神券', '低至 5 折', '高温防晒', '日常修护', '清透彩妆'],
    coupons: [
      { amount: '¥120', limit: '满 900 可用' },
      { amount: '¥80', limit: '满 600 可用' },
      { amount: '¥50', limit: '满 300 可用' },
      { amount: '¥25', limit: '满 150 可用' },
    ],
  },
  cat_office: {
    theme: 'office',
    tag: '效率装备季',
    title: '办公学习 高效装备专区',
    subtitle: '键盘、耳机和学习桌面设备，覆盖课程与会议',
    search: '键盘',
    navs: ['效率办公', '学习装备', '会议通勤', '桌面升级', '精选配件'],
    coupons: [
      { amount: '¥200', limit: '满 2000 可用' },
      { amount: '¥100', limit: '满 1000 可用' },
      { amount: '¥60', limit: '满 600 可用' },
      { amount: '¥30', limit: '满 300 可用' },
    ],
  },
  cat_wear: {
    theme: 'wear',
    tag: '运动焕新季',
    title: '运动穿戴 夏季尖货低至 8.5 折',
    subtitle: '运动手表、开放式耳机与健康装备集中上新',
    search: '运动手表',
    navs: ['运动惊喜券', '限时秒杀', '夏日精选', '热卖好货', '运动新趋势'],
    coupons: [
      { amount: '¥180', limit: '满 1600 可用' },
      { amount: '¥100', limit: '满 900 可用' },
      { amount: '¥60', limit: '满 500 可用' },
      { amount: '¥25', limit: '满 200 可用' },
    ],
  },
};

export default function ActivityPage() {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const orderRef = useRef(null);
  const productRef = useRef(null);
  const recommendRef = useRef(null);
  const category = getCategoryById(activityId);
  const categories = getCategories();
  const copy = ACTIVITY_COPY[activityId] || {};
  const interactiveCoupon = activityId === 'cat_phone';
  const activityProducts = category ? getProducts({ categoryId: category.id, pageSize: 16 }).all : [];
  const coupons = useMallData(function () {
    return getActivityCoupons(activityId, user?.id);
  }, [activityId, user?.id]);
  const recommendProducts = useMemo(function () {
    return getProducts({ pageSize: 10 }).all.filter(function (product) {
      return product.categoryId !== activityId;
    }).slice(0, 5);
  }, [activityId]);

  if (!category) {
    return (
      <main className="activity-page">
        <div className="activity-empty">
          <Empty description="这个活动暂时不存在">
            <Button type="primary" onClick={function () { navigate('/'); }}>返回首页</Button>
          </Empty>
        </div>
      </main>
    );
  }

  const featuredProducts = activityProducts.slice(0, 4);
  const couponProducts = activityProducts.slice(0, 3);
  const moreProducts = activityProducts.slice(0, 6);

  function openActivity(categoryId) {
    navigate('/activity/' + categoryId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openProduct(productId) {
    navigate('/product/' + productId);
  }

  function ensureLogin() {
    if (user) return true;
    navigate('/login', { state: { from: location } });
    return false;
  }

  function scrollToSection(index) {
    const refs = [orderRef, productRef, productRef, productRef, recommendRef];
    refs[index]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function searchActivityKeyword() {
    navigate('/search?keyword=' + encodeURIComponent(copy.search || category.name));
  }

  function getCouponButtonText(coupon) {
    if (coupon.status === 'claimed') return '去使用';
    if (coupon.status === 'soldOut') return '已抢光';
    if (coupon.status === 'expired') return '已结束';
    return '领取';
  }

  function handleClaimCoupon(coupon) {
    if (!interactiveCoupon) return;
    if (coupon.status === 'claimed') {
      productRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (coupon.status !== 'claimable') return;
    if (!ensureLogin()) return;
    try {
      const result = claimCoupon(user.id, coupon.id);
      message.success(result.claimed ? '优惠券领取成功' : '你已经领取过这张券');
    } catch (error) {
      message.warning(error.message || '领取失败');
    }
  }

  function handleClaimAll() {
    if (!interactiveCoupon || !ensureLogin()) return;
    try {
      const result = claimActivityCoupons(user.id, activityId);
      if (result.claimed) {
        message.success('成功领取 ' + result.claimed + ' 张优惠券');
      } else {
        message.info('当前没有新的可领优惠券');
      }
    } catch (error) {
      message.warning(error.message || '一键领券失败');
    }
  }

  function handleMiniCoupon(product, coupon) {
    if (interactiveCoupon && coupon?.status === 'claimable') {
      if (!ensureLogin()) return;
      try {
        claimCoupon(user.id, coupon.id);
        message.success('优惠券领取成功，已为你打开商品');
      } catch (error) {
        message.warning(error.message || '领取失败');
        return;
      }
    }
    openProduct(product.id);
  }

  return (
    <main className={'activity-page activity-theme-' + (copy.theme || 'phone')}>
      <section className="activity-top">
        <button className="activity-home-link" onClick={function () { navigate('/'); }}>
          <ArrowLeftOutlined /> 回到主会场
        </button>
        <button className="activity-search-mini" onClick={searchActivityKeyword}>
          <span>{copy.search || category.name}</span>
          <SearchOutlined />
        </button>
      </section>

      <section className="activity-campaign-hero">
        <div className="activity-hero-text">
          <span><FireOutlined /> {copy.tag || '限时活动'}</span>
          <h1>{copy.title || category.name + '限时活动'}</h1>
          <p>{copy.subtitle || category.description}</p>
        </div>
        <img alt={category.name} src={category.cover} />
      </section>

      <nav className="activity-nav" aria-label="活动导航">
        {copy.navs?.map(function (nav, index) {
          return <button className={index === 0 ? 'active' : ''} key={nav} onClick={function () { scrollToSection(index); }}>{nav}</button>;
        })}
      </nav>

      <section className="activity-coupon-panel">
        <div className="activity-coupon-title">
          <strong>618 巅峰消费券</strong>
          <span>领取后下单可用，数量有限</span>
        </div>
        <div className="activity-coupon-grid">
          {(interactiveCoupon ? coupons : copy.coupons)?.map(function (coupon) {
            const staticCoupon = !interactiveCoupon;
            return (
              <button
                className={'activity-coupon activity-coupon-' + (coupon.status || 'static')}
                disabled={!staticCoupon && !['claimable', 'claimed'].includes(coupon.status)}
                key={coupon.id || coupon.amount + coupon.limit}
                onClick={function () { handleClaimCoupon(coupon); }}
              >
                <strong>{staticCoupon ? coupon.amount : formatPrice(coupon.amount).replace('.00', '')}</strong>
                <span>{staticCoupon ? coupon.limit : '满 ' + coupon.threshold + ' 可用'}</span>
                {!staticCoupon ? <em>{getCouponButtonText(coupon)}</em> : null}
              </button>
            );
          })}
        </div>
        <button className="activity-vip-coupon" onClick={handleClaimAll}>
          {interactiveCoupon ? '一键领取手机数码优惠券' : '开通会员兑换专属消费券'}
        </button>
      </section>

      <section className="activity-order-panel" ref={orderRef}>
        <div className="activity-panel-head">
          <h2>先领券再下单</h2>
          <button onClick={function () { productRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
            查看更多 <RightOutlined />
          </button>
        </div>
        <div className="activity-order-layout">
          <div className="activity-mini-coupons">
            {couponProducts.map(function (product, index) {
              const coupon = coupons[index];
              return (
                <button className="activity-mini-coupon" key={product.id} onClick={function () { handleMiniCoupon(product, coupon); }}>
                  <img alt={product.name} src={product.cover} />
                  <div>
                    <strong>{coupon ? formatPrice(coupon.amount).replace('.00', '') : '¥50'}</strong>
                    <span>{product.tags?.[0] || category.name}加补券</span>
                    <small>{coupon ? '满 ' + coupon.threshold + ' 可用' : '指定商品可用'}</small>
                  </div>
                  <em>{coupon?.status === 'claimable' ? '先领券' : '立即抢'}</em>
                </button>
              );
            })}
          </div>
          <div className="activity-featured-products">
            {featuredProducts.map(function (product) {
              return (
                <button className="activity-feature-card" key={product.id} onClick={function () { openProduct(product.id); }}>
                  <img alt={product.name} src={product.cover} />
                  <span>{product.name}</span>
                  <strong>{formatPrice(product.price)}</strong>
                  <ShoppingCartOutlined />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="activity-product-panel" ref={productRef}>
        <div className="activity-panel-head">
          <h2>{category.name}精选</h2>
          <p>活动价商品实时更新</p>
        </div>
        <div className="activity-product-row">
          {moreProducts.map(function (product) {
            return (
              <button className="activity-product-card" key={product.id} onClick={function () { openProduct(product.id); }}>
                <img alt={product.name} src={product.cover} />
                <span>{product.name}</span>
                <small>{product.description}</small>
                <strong>{formatPrice(product.price)}</strong>
              </button>
            );
          })}
        </div>
      </section>

      <section className="activity-product-panel" ref={recommendRef}>
        <div className="activity-panel-head">
          <h2>猜你喜欢</h2>
          <p>从其他会场继续逛逛</p>
        </div>
        <div className="activity-recommend-row">
          {categories.map(function (item) {
            return (
              <button
                className={'activity-recommend-tab' + (item.id === category.id ? ' active' : '')}
                key={item.id}
                onClick={function () { openActivity(item.id); }}
              >
                {item.name}
              </button>
            );
          })}
        </div>
        <div className="activity-product-row">
          {recommendProducts.map(function (product) {
            return (
              <button className="activity-product-card" key={product.id} onClick={function () { openProduct(product.id); }}>
                <img alt={product.name} src={product.cover} />
                <span>{product.name}</span>
                <small>{product.categoryName}</small>
                <strong>{formatPrice(product.price)}</strong>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
