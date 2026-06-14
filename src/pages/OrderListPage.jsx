import {
  CheckCircleOutlined,
  LeftOutlined,
  RightOutlined,
  SearchOutlined,
  WalletOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { Empty } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useMallData } from '../hooks/useMallData';
import { formatPrice } from '../utils/formatters';
import { getOrders } from '../utils/mallStore';

// ==================== 内联样式 ====================
const S = {
  page: {
    minHeight: '100%',
    background: '#ffffff',
    padding: '48px 24px 80px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '36px',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: 0,
    border: 'none',
    background: 'none',
    color: '#0066cc',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    textDecoration: 'none',
    marginBottom: '16px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#1d1d1f',
    letterSpacing: '-0.6px',
    margin: 0,
  },
  subtitle: {
    fontSize: '16px',
    color: '#6e6e73',
    marginTop: '6px',
  },
  toolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '28px',
  },
  searchWrap: {
    position: 'relative',
    flex: '1 1 260px',
    maxWidth: '360px',
  },
  searchInput: {
    width: '100%',
    height: '44px',
    padding: '0 44px 0 16px',
    borderRadius: '22px',
    border: '1px solid #d2d2d7',
    fontSize: '14px',
    color: '#1d1d1f',
    background: '#f5f5f7',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, background 0.2s',
  },
  searchIcon: {
    position: 'absolute',
    right: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#86868b',
    fontSize: '16px',
    pointerEvents: 'none',
  },
  filterBtn: (active) => ({
    padding: '8px 18px',
    borderRadius: '22px',
    border: active ? '1px solid #1d1d1f' : '1px solid #d2d2d7',
    background: active ? '#1d1d1f' : '#ffffff',
    color: active ? '#fff' : '#6e6e73',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  }),
  sortBtn: {
    padding: '8px 14px',
    borderRadius: '22px',
    border: '1px solid #d2d2d7',
    background: '#ffffff',
    color: '#6e6e73',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s',
  },
  sortBtnActive: {
    padding: '8px 14px',
    borderRadius: '22px',
    border: '1px solid #1d1d1f',
    background: '#f5f5f7',
    color: '#1d1d1f',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  orderCard: {
    background: '#ffffff',
    borderRadius: '24px',
    border: '1px solid #e5e5e7',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    padding: '28px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    transition: 'box-shadow 0.2s, border-color 0.2s',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  },
  orderNo: {
    fontSize: '15px',
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
  cardMid: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
    fontSize: '14px',
    color: '#6e6e73',
  },
  cardBottom: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
    paddingTop: '16px',
    borderTop: '1px solid #f0f0f0',
  },
  orderAmount: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#1d1d1f',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  primaryBtn: {
    padding: '8px 20px',
    borderRadius: '20px',
    border: 'none',
    background: '#0071e3',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background 0.2s',
  },
  linkBtn: {
    padding: '8px 16px',
    borderRadius: '20px',
    border: 'none',
    background: 'transparent',
    color: '#0071e3',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'background 0.15s',
  },
  emptyWrap: {
    textAlign: 'center',
    padding: '64px 0',
    color: '#86868b',
    fontSize: '15px',
  },
  paginationRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '36px',
  },
  pageBtn: (disabled) => ({
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    border: '1px solid #d2d2d7',
    background: '#ffffff',
    color: disabled ? '#d2d2d7' : '#1d1d1f',
    fontSize: '16px',
    cursor: disabled ? 'default' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  }),
  pageInfo: {
    fontSize: '14px',
    color: '#6e6e73',
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

// ==================== 排序选项 ====================
const SORT_OPTIONS = [
  { key: 'newest', label: '最新下单' },
  { key: 'oldest', label: '最早下单' },
  { key: 'price-high', label: '金额从高到低' },
  { key: 'price-low', label: '金额从低到高' },
];

// ==================== 筛选 Tabs ====================
const STATUS_TABS = [
  { key: 'all', label: '全部订单' },
  { key: '待付款', label: '待付款' },
  { key: '待发货', label: '待发货' },
  { key: '待收货', label: '待收货' },
  { key: '已完成', label: '已完成' },
];

// ==================== 页面组件 ====================
export default function OrderListPage() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [status, setStatus] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('newest');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // ---- 覆盖灰色背景 ----
  useEffect(() => {
    const el = document.querySelector('.page-content');
    if (!el) return;
    el.style.background = '#ffffff';
    return () => { el.style.background = ''; };
  }, []);

  // ---- 搜索带防抖 ----
  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ---- 数据 ----
  const statusParam = status === 'all' ? 'all' : status;
  const ordersResult = useMallData(function () {
    return getOrders({ userId: user.id, status: statusParam, keyword, page: 1, pageSize: 999 });
  }, [user.id, statusParam, keyword]);

  // ---- 前端排序 ----
  function applySort(list) {
    const sorted = [...list];
    switch (sortKey) {
      case 'newest':
        sorted.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
        break;
      case 'oldest':
        sorted.sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
        break;
      case 'price-high':
        sorted.sort((a, b) => b.totalAmount - a.totalAmount);
        break;
      case 'price-low':
        sorted.sort((a, b) => a.totalAmount - b.totalAmount);
        break;
    }
    return sorted;
  }

  const sortedList = applySort(ordersResult.list);
  const totalItems = sortedList.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const pagedList = sortedList.slice((page - 1) * pageSize, page * pageSize);

  // ---- 输入框交互 ----
  const onFocus = (e) => { e.target.style.borderColor = '#1d1d1f'; e.target.style.background = '#fff'; };
  const onBlur = (e) => { e.target.style.borderColor = '#d2d2d7'; e.target.style.background = '#f5f5f7'; };

  return (
    <div style={S.page}>
      <div style={S.container}>

        {/* 标题 */}
        <div style={S.header}>
          <button
            style={S.backLink}
            onClick={() => navigate('/profile')}
            onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
            onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
          >
            <LeftOutlined style={{ fontSize: 11 }} />
            返回个人中心
          </button>
          <h1 style={S.title}>我的订单</h1>
          <p style={S.subtitle}>查看、搜索和管理你的商城订单</p>
        </div>

        {/* 搜索 + 排序 */}
        <div style={S.toolbar}>
          <div style={S.searchWrap}>
            <input
              style={S.searchInput}
              type="text"
              placeholder="搜索订单号"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
            />
            <SearchOutlined style={S.searchIcon} />
          </div>

          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              style={sortKey === opt.key ? S.sortBtnActive : S.sortBtn}
              onClick={() => { setSortKey(opt.key); setPage(1); }}
              onMouseEnter={(e) => { if (sortKey !== opt.key) { e.currentTarget.style.borderColor = '#1d1d1f'; e.currentTarget.style.color = '#1d1d1f'; } }}
              onMouseLeave={(e) => { if (sortKey !== opt.key) { e.currentTarget.style.borderColor = '#d2d2d7'; e.currentTarget.style.color = '#6e6e73'; } }}
            >
              {sortKey === opt.key ? <CheckCircleOutlined style={{ fontSize: 12 }} /> : null}
              {opt.label}
            </button>
          ))}
        </div>

        {/* 状态筛选 */}
        <div style={{ ...S.toolbar, marginBottom: '32px' }}>
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              style={S.filterBtn(status === tab.key)}
              onClick={() => { setStatus(tab.key); setPage(1); }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 订单列表 */}
        {pagedList.length ? (
          <>
            <div style={S.list}>
              {pagedList.map((order) => (
                <div
                  key={order.id}
                  style={S.orderCard}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#c0c0c5'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e5e7'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; }}
                >
                  {/* 行 1: 编号 + 状态 */}
                  <div style={S.cardTop}>
                    <span style={S.orderNo}>{order.orderNo}</span>
                    <span style={S.statusTag(STATUS_COLORS[order.status] || '#86868b')}>
                      {order.status}
                    </span>
                  </div>

                  {/* 行 2: 商品摘要 + 时间 */}
                  <div style={S.cardMid}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                      {order.items?.[0]?.productName || '--'}
                      {order.itemCount > 1 ? ` 等${order.itemCount}件商品` : ''}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ClockCircleOutlined style={{ fontSize: 12 }} />
                      {order.createdAt}
                    </span>
                  </div>

                  {/* 行 3: 金额 + 操作 */}
                  <div style={S.cardBottom}>
                    <span style={S.orderAmount}>{formatPrice(order.totalAmount)}</span>
                    <div style={S.actions}>
                      <button
                        style={S.linkBtn}
                        onClick={() => navigate('/order/' + order.id)}
                      >
                        查看详情
                        <RightOutlined style={{ fontSize: 11 }} />
                      </button>
                      {order.status === '待付款' && (
                        <button
                          style={S.primaryBtn}
                          onClick={() => navigate('/pay/' + order.id)}
                        >
                          <WalletOutlined style={{ marginRight: '5px' }} />
                          去支付
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div style={S.paginationRow}>
                <button style={S.pageBtn(page <= 1)} disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <span style={S.pageInfo}>
                  第 {page} / {totalPages} 页
                </span>
                <button style={S.pageBtn(page >= totalPages)} disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={S.emptyWrap}>
            <Empty description={keyword ? '未找到匹配的订单' : '暂无订单'} />
          </div>
        )}
      </div>
    </div>
  );
}
