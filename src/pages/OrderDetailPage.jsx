import {
  EnvironmentOutlined,
  LeftOutlined,
  PhoneOutlined,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMallData } from '../hooks/useMallData';
import { formatPrice } from '../utils/formatters';
import { getOrderById } from '../utils/mallStore';

// ==================== 内联样式 ====================
const S = {
  page: {
    minHeight: '100%',
    background: '#ffffff',
    padding: '48px 24px 80px',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 0',
    border: 'none',
    background: 'none',
    color: '#0071e3',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    marginBottom: '8px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#1d1d1f',
    letterSpacing: '-0.6px',
    margin: 0,
  },
  card: {
    background: '#ffffff',
    borderRadius: '24px',
    border: '1px solid #e5e5e7',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    padding: '32px',
  },
  cardTitle: {
    fontSize: '17px',
    fontWeight: 600,
    color: '#1d1d1f',
    margin: '0 0 20px',
  },
  // ---- 摘要卡片 ----
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
  },
  metaLabel: {
    fontSize: '13px',
    color: '#86868b',
    marginBottom: '4px',
  },
  metaValue: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#1d1d1f',
  },
  statusTag: (color) => ({
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
    color,
    background: `${color}14`,
  }),
  summaryBottom: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '1px solid #f0f0f0',
  },
  totalAmount: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#1d1d1f',
  },
  primaryBtn: {
    padding: '10px 24px',
    borderRadius: '24px',
    border: 'none',
    background: '#0071e3',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  // ---- 收货信息 ----
  addressGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  addressItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '16px',
    borderRadius: '14px',
    background: '#f5f5f7',
  },
  addressLabel: {
    fontSize: '12px',
    color: '#86868b',
    fontWeight: 500,
  },
  addressValue: {
    fontSize: '15px',
    fontWeight: 500,
    color: '#1d1d1f',
  },

  // ---- 商品清单 ----
  productItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  productImg: {
    width: '64px',
    height: '64px',
    borderRadius: '12px',
    objectFit: 'cover',
    flexShrink: 0,
    background: '#f5f5f7',
  },
  productInfo: {
    flex: 1,
    minWidth: 0,
  },
  productName: {
    fontSize: '15px',
    fontWeight: 500,
    color: '#1d1d1f',
    marginBottom: '4px',
  },
  productSpec: {
    fontSize: '13px',
    color: '#86868b',
  },
  productQty: {
    fontSize: '14px',
    color: '#86868b',
    marginLeft: '12px',
  },
  productPrice: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#1d1d1f',
    whiteSpace: 'nowrap',
  },
  // ---- 金额汇总 ----
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    fontSize: '15px',
    color: '#6e6e73',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    fontSize: '18px',
    fontWeight: 700,
    color: '#1d1d1f',
    borderTop: '1px solid #e5e5e7',
    marginTop: '8px',
  },
};

// ==================== 状态颜色 ====================
const STATUS_COLORS = {
  '待付款': '#ff9500',
  '待发货': '#0071e3',
  '待收货': '#34c759',
  '已完成': '#af52de',
  '已取消': '#ff3b30',
};

// ==================== 页面组件 ====================
export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const order = useMallData(function () { return getOrderById(id); }, [id]);

  // ---- 覆盖灰色背景 ----
  useEffect(() => {
    const el = document.querySelector('.page-content');
    if (!el) return;
    el.style.background = '#ffffff';
    return () => { el.style.background = ''; };
  }, []);

  if (!order) {
    return (
      <div style={S.page}>
        <div style={S.container}>
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#86868b', fontSize: '16px' }}>
            订单不存在。
          </div>
        </div>
      </div>
    );
  }

  const statusColor = STATUS_COLORS[order.status] || '#86868b';
  const sourceLabel = order.source === 'cart' ? '购物车结算' : '立即购买';

  return (
    <div style={S.page}>
      <div style={S.container}>

        {/* 返回 */}
        <button style={S.backBtn} onClick={() => navigate('/orders')}>
          <LeftOutlined style={{ fontSize: 12 }} />
          返回订单列表
        </button>

        <h1 style={S.title}>订单详情</h1>

        {/* 1. 摘要卡片 */}
        <div style={S.card}>
          <h2 style={S.cardTitle}>订单信息</h2>
          <div style={S.summaryGrid}>
            <div>
              <div style={S.metaLabel}>订单编号</div>
              <div style={S.metaValue}>{order.orderNo}</div>
            </div>
            <div>
              <div style={S.metaLabel}>订单状态</div>
              <span style={S.statusTag(statusColor)}>{order.status}</span>
            </div>
            <div>
              <div style={S.metaLabel}>下单时间</div>
              <div style={S.metaValue}>{order.createdAt}</div>
            </div>
            <div>
              <div style={S.metaLabel}>订单来源</div>
              <div style={S.metaValue}>{sourceLabel}</div>
            </div>
          </div>

          <div style={S.summaryBottom}>
            <span style={S.totalAmount}>{formatPrice(order.totalAmount)}</span>
            {order.status === '待付款' && (
              <button style={S.primaryBtn} onClick={() => navigate('/pay/' + order.id)}>
                <WalletOutlined />
                去支付
              </button>
            )}
          </div>
        </div>

        {/* 2. 收货信息卡片 */}
        <div style={S.card}>
          <h2 style={S.cardTitle}>收货信息</h2>
          {order.address ? (
            <div style={S.addressGrid}>
              <div style={S.addressItem}>
                <div style={S.addressLabel}><UserOutlined style={{ marginRight: '4px' }} />收货人</div>
                <div style={S.addressValue}>{order.address.receiver}</div>
              </div>
              <div style={S.addressItem}>
                <div style={S.addressLabel}><PhoneOutlined style={{ marginRight: '4px' }} />联系方式</div>
                <div style={S.addressValue}>{order.address.phone}</div>
              </div>
              <div style={S.addressItem}>
                <div style={S.addressLabel}><EnvironmentOutlined style={{ marginRight: '4px' }} />收货地址</div>
                <div style={S.addressValue}>{order.address.region} {order.address.detail}</div>
              </div>
            </div>
          ) : (
            <div style={{ color: '#86868b', fontSize: '14px' }}>暂无收货信息</div>
          )}
        </div>

        {/* 3. 商品清单卡片 */}
        <div style={S.card}>
          <h2 style={S.cardTitle}>商品清单</h2>
          {order.items?.map((item, i) => (
            <div key={item.id || i} style={S.productItem}>
              <img
                src={item.cover}
                alt={item.productName}
                style={S.productImg}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div style={S.productInfo}>
                <div style={S.productName}>{item.productName}</div>
                <div style={S.productSpec}>
                  {item.spec || '--'}
                  <span style={S.productQty}>x {item.quantity}</span>
                </div>
              </div>
              <div style={S.productPrice}>{formatPrice(item.price * item.quantity)}</div>
            </div>
          ))}
        </div>

        {/* 4. 金额汇总卡片 */}
        <div style={S.card}>
          <h2 style={S.cardTitle}>金额汇总</h2>
          <div style={S.summaryRow}>
            <span>商品总额</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
          <div style={S.summaryTotal}>
            <span>应付金额</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
