import { Empty, Modal, Popconfirm, message } from 'antd';
import {
  CameraOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  UserOutlined,
  ClockCircleOutlined,
  WalletOutlined,
  SendOutlined,
  CarOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ManOutlined,
  WomanOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useMallData } from '../hooks/useMallData';
import { formatPrice } from '../utils/formatters';
import { deleteAddress, getAddresses, getOrders, saveAddress, setDefaultAddress, updateCurrentUserProfile } from '../utils/mallStore';

// ==================== 内联样式 ====================
const S = {
  page: {
    minHeight: '100vh',
    background: '#ffffff',
    padding: '48px 24px 80px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    padding: '36px',
    border: 'none',
  },
  welcomeCard: {
    background: '#ffffff',
    borderRadius: '28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    padding: '40px',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  avatar: {
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    background: '#f5f5f7',
    border: '1px solid #e5e5e7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#86868b',
    fontSize: '36px',
    flexShrink: 0,
    position: 'relative',
    cursor: 'pointer',
    overflow: 'hidden',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'opacity 0.2s',
  },
  avatarOverlay: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 500,
    opacity: 0,
    transition: 'opacity 0.2s',
    flexDirection: 'column',
    gap: '4px',
  },
  welcomeInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  welcomeName: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#1d1d1f',
    letterSpacing: '-0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  welcomeMeta: {
    fontSize: '15px',
    color: '#86868b',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  signatureLine: {
    fontSize: '14px',
    color: '#6e6e73',
    marginTop: '8px',
    fontStyle: 'italic',
  },
  editProfileBtn: {
    alignSelf: 'flex-start',
    padding: '8px 20px',
    borderRadius: '20px',
    border: '1px solid #d2d2d7',
    background: '#ffffff',
    color: '#1d1d1f',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    marginLeft: 'auto',
    flexShrink: 0,
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'border-color 0.2s, background 0.2s',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  },
  statCard: {
    background: '#ffffff',
    borderRadius: '22px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    padding: '28px 24px',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    cursor: 'default',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  statIconWrap: {
    width: '52px',
    height: '52px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: 700,
    color: '#1d1d1f',
    lineHeight: 1,
  },
  statLabel: {
    fontSize: '14px',
    color: '#86868b',
    fontWeight: 500,
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#1d1d1f',
    letterSpacing: '-0.3px',
    margin: 0,
  },
  sectionSub: {
    fontSize: '14px',
    color: '#86868b',
    marginTop: '4px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  orderItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 0',
    borderBottom: '1px solid #f0f0f0',
    gap: '16px',
    flexWrap: 'wrap',
  },
  orderItemLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: 0,
    flex: 1,
  },
  orderNo: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#1d1d1f',
  },
  orderMeta: {
    fontSize: '13px',
    color: '#86868b',
  },
  statusBadge: (color) => ({
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
    color,
    background: `${color}14`,
    marginLeft: '8px',
  }),
  orderPrice: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#1d1d1f',
  },
  actionBtn: {
    border: 'none',
    background: 'none',
    color: '#0071e3',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    padding: '6px 12px',
    borderRadius: '20px',
    transition: 'background 0.15s',
  },
  addressGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  addressCard: {
    background: '#ffffff',
    borderRadius: '20px',
    border: '1px solid #e5e5e7',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    position: 'relative',
    transition: 'box-shadow 0.25s ease, border-color 0.25s ease, transform 0.25s ease',
  },
  addressName: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#1d1d1f',
  },
  addressPhone: {
    fontSize: '15px',
    color: '#86868b',
    marginLeft: '12px',
  },
  addressDetail: {
    fontSize: '14px',
    color: '#515154',
    lineHeight: 1.5,
  },
  addressTag: (isDefault) => ({
    display: 'inline-block',
    padding: '3px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 500,
    background: isDefault ? '#f0f7ff' : '#f5f5f7',
    color: isDefault ? '#0071e3' : '#86868b',
    border: isDefault ? '1px solid rgba(0,113,227,0.2)' : 'none',
    alignSelf: 'flex-start',
  }),
  addressActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '4px',
  },
  addressActionLink: {
    border: 'none',
    background: 'none',
    color: '#6e6e73',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    padding: 0,
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'color 0.15s',
  },
  formCard: {
    background: '#ffffff',
    borderRadius: '28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    padding: '36px',
    border: 'none',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  formInput: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid #d2d2d7',
    fontSize: '15px',
    color: '#1d1d1f',
    background: '#f5f5f7',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, background 0.2s',
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
    transition: 'background 0.2s',
    letterSpacing: '-0.2px',
  },
  secondaryBtn: {
    padding: '10px 24px',
    borderRadius: '24px',
    border: 'none',
    background: '#f5f5f7',
    color: '#1d1d1f',
    fontSize: '15px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  emptyWrap: {
    textAlign: 'center',
    padding: '48px 0',
    color: '#86868b',
    fontSize: '15px',
  },
  paginationWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '24px',
  },
  // ---- 编辑资料 Modal ----
  modalField: {
    marginBottom: '20px',
  },
  modalLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#1d1d1f',
    marginBottom: '6px',
    display: 'block',
  },
  modalInput: {
    width: '100%',
    height: '46px',
    padding: '0 14px',
    borderRadius: '12px',
    border: '1px solid #d2d2d7',
    fontSize: '15px',
    color: '#1d1d1f',
    background: '#f5f5f7',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, background 0.2s',
  },
  modalTextarea: {
    width: '100%',
    minHeight: '80px',
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid #d2d2d7',
    fontSize: '15px',
    color: '#1d1d1f',
    background: '#f5f5f7',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'vertical',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s, background 0.2s',
  },
  genderGroup: {
    display: 'flex',
    gap: '12px',
  },
  genderOption: (active) => ({
    flex: 1,
    padding: '12px 0',
    borderRadius: '12px',
    border: active ? '2px solid #0071e3' : '1px solid #d2d2d7',
    background: active ? '#f0f7ff' : '#f5f5f7',
    color: active ? '#0071e3' : '#6e6e73',
    fontSize: '15px',
    fontWeight: active ? 600 : 400,
    cursor: 'pointer',
    textAlign: 'center',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'all 0.2s',
  }),
};

// ==================== 状态标签颜色映射 ====================
const STATUS_COLORS = {
  '待付款': '#ff9500',
  '待发货': '#0071e3',
  '待收货': '#34c759',
  '已完成': '#af52de',
  '已取消': '#ff3b30',
};

// ==================== 主页面组件 ====================
export default function ProfilePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useUser();
  const section = searchParams.get('section');

  // ---- 区域 ref ----
  const overviewRef = useRef(null);
  const ordersRef = useRef(null);
  const addressRef = useRef(null);

  const [highlightId, setHighlightId] = useState(null);

  // ---- 地址 Modal ----
  const [addrModalOpen, setAddrModalOpen] = useState(false);
  const [addrEditing, setAddrEditing] = useState(null); // null = 新增
  const [addrReceiver, setAddrReceiver] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrRegion, setAddrRegion] = useState('');
  const [addrDetail, setAddrDetail] = useState('');
  const [addrTag, setAddrTag] = useState('');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  function openAddressModal(address) {
    if (address) {
      setAddrReceiver(address.receiver || '');
      setAddrPhone(address.phone || '');
      setAddrRegion(address.region || '');
      setAddrDetail(address.detail || '');
      setAddrTag(address.tag || '');
      setAddrIsDefault(Boolean(address.isDefault));
      setAddrEditing(address);
    } else {
      setAddrReceiver(''); setAddrPhone(''); setAddrRegion('');
      setAddrDetail(''); setAddrTag(''); setAddrIsDefault(false);
      setAddrEditing(null);
    }
    setAddrModalOpen(true);
  }

  function handleSaveAddress() {
    if (!addrReceiver || !addrPhone || !addrRegion || !addrDetail || !addrTag) {
      message.warning('请完整填写地址信息'); return;
    }
    if (!/^1\d{10}$/.test(addrPhone)) { message.warning('请输入正确手机号'); return; }
    saveAddress({
      ...addrEditing,
      receiver: addrReceiver,
      phone: addrPhone,
      region: addrRegion,
      detail: addrDetail,
      tag: addrTag,
      isDefault: addrIsDefault,
      userId: user.id,
    });
    message.success(addrEditing ? '地址修改成功' : '地址新增成功');
    setAddrModalOpen(false);
  }

  // ---- 编辑资料 ----
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [editGender, setEditGender] = useState('');
  const [editSignature, setEditSignature] = useState('');
  const [saving, setSaving] = useState(false);

  function openProfileModal() {
    setEditNickname(user.nickname || '');
    setEditGender(user.gender || '');
    setEditSignature(user.signature || '');
    setProfileModalOpen(true);
  }

  async function handleSaveProfile() {
    if (!editNickname.trim()) { message.warning('昵称不能为空'); return; }
    setSaving(true);
    try {
      updateCurrentUserProfile({ nickname: editNickname.trim(), gender: editGender, signature: editSignature });
      message.success('资料已更新');
      setProfileModalOpen(false);
    } catch (e) {
      message.error('资料更新失败');
    } finally {
      setSaving(false);
    }
  }

  // ---- 头像上传 ----
  const fileInputRef = useRef(null);
  function handleAvatarClick() { fileInputRef.current?.click(); }
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { message.warning('请选择图片文件'); return; }
    if (file.size > 2 * 1024 * 1024) { message.warning('图片大小不能超过 2MB'); return; }
    const reader = new FileReader();
    reader.onload = function () {
      updateCurrentUserProfile({ avatar: reader.result });
      message.success('头像已更新');
    };
    reader.readAsDataURL(file);
    // reset so same file can be re-selected
    e.target.value = '';
  }

  const hasAvatar = user.avatar && user.avatar.startsWith('data:');

  // ---- 数据层：最近订单（仅显示最近 3 条） ----
  const recentOrders = useMallData(function () {
    return getOrders({ userId: user.id, pageSize: 3 }).list;
  }, [user.id]);

  // ---- 数据层：全部订单（用于统计卡片） ----
  const allOrders = useMallData(function () {
    return getOrders({ userId: user.id, pageSize: 999 }).all;
  }, [user.id]);

  // ---- 数据层：地址列表 ----
  const addresses = useMallData(function () {
    return getAddresses(user.id);
  }, [user.id]);

  // ---- 订单统计 ----
  const orderStats = {
    pendingPay: allOrders.filter((o) => o.status === '待付款').length,
    pendingShip: allOrders.filter((o) => o.status === '待发货').length,
    pendingReceipt: allOrders.filter((o) => o.status === '待收货').length,
    completed: allOrders.filter((o) => o.status === '已完成').length,
  };

  // ---- 根据 URL query section 滚动到对应区域并高亮 ----
  useEffect(() => {
    const sectionMap = { overview: overviewRef, orders: ordersRef, addresses: addressRef };
    const targetRef = sectionMap[section];
    if (!targetRef?.current) return;
    setTimeout(() => {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // 高亮动画
      setHighlightId(section);
      setTimeout(() => setHighlightId(null), 1600);
    }, 250);
  }, [section]);

  // ---- 覆盖 .page-content 灰色背景为白色 ----
  useEffect(() => {
    const el = document.querySelector('.page-content');
    if (!el) return;
    el.style.background = '#ffffff';
    return () => { el.style.background = ''; };
  }, []);

  // ---- 统计卡片配置 ----
  const statCards = [
    { key: 'pay', label: '待付款', count: orderStats.pendingPay, icon: <WalletOutlined />, color: '#ff9500' },
    { key: 'ship', label: '待发货', count: orderStats.pendingShip, icon: <SendOutlined />, color: '#0071e3' },
    { key: 'receipt', label: '待收货', count: orderStats.pendingReceipt, icon: <CarOutlined />, color: '#34c759' },
    { key: 'done', label: '已完成', count: orderStats.completed, icon: <CheckCircleOutlined />, color: '#af52de' },
  ];

  // ---- 卡片高亮辅助 ----
  function cardHighlight(id) {
    if (highlightId !== id) return {};
    return {
      boxShadow: '0 0 0 3px rgba(0,113,227,0.25), 0 2px 12px rgba(0,0,0,0.04)',
      transition: 'box-shadow 0.4s ease',
    };
  }

  return (
    <div style={S.page}>
      <div style={S.container}>

        {/* ========== 1. 欢迎卡片 ========== */}
        <div style={{ ...S.welcomeCard, ...cardHighlight('overview') }} ref={overviewRef}>
          {/* 头像 */}
          <div
            style={{
              ...S.avatar,
              backgroundImage: hasAvatar ? `url(${user.avatar})` : undefined,
            }}
            onClick={handleAvatarClick}
            onMouseEnter={(e) => { e.currentTarget.querySelector('[data-avatar-overlay]').style.opacity = '1'; }}
            onMouseLeave={(e) => { e.currentTarget.querySelector('[data-avatar-overlay]').style.opacity = '0'; }}
          >
            {!hasAvatar && <UserOutlined />}
            <div data-avatar-overlay style={S.avatarOverlay}>
              <CameraOutlined style={{ fontSize: 18 }} />
              更换头像
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
          </div>

          {/* 信息 */}
          <div style={S.welcomeInfo}>
            <h1 style={S.welcomeName}>
              {user.nickname || user.username}
              {user.gender === 'male' && <ManOutlined style={{ fontSize: 20, color: '#0071e3' }} />}
              {user.gender === 'female' && <WomanOutlined style={{ fontSize: 20, color: '#ff6b8a' }} />}
            </h1>
            <div style={S.welcomeMeta}>
              <span style={S.metaItem}>
                <UserOutlined style={{ fontSize: 13 }} />
                {user.username}
              </span>
              <span style={S.metaItem}>
                <PhoneOutlined style={{ fontSize: 13 }} />
                {user.phone}
              </span>
              <span style={S.metaItem}>
                <ClockCircleOutlined style={{ fontSize: 13 }} />
                {user.createdAt}
              </span>
            </div>
            {user.signature && (
              <div style={S.signatureLine}>"{user.signature}"</div>
            )}
          </div>

          {/* 编辑资料按钮 */}
          <button
            style={S.editProfileBtn}
            onClick={openProfileModal}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1d1d1f'; e.currentTarget.style.background = '#f5f5f7'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d2d2d7'; e.currentTarget.style.background = '#ffffff'; }}
          >
            <EditOutlined style={{ fontSize: 13 }} />
            编辑资料
          </button>
        </div>

        {/* ========== 编辑资料 Modal ========== */}
        <Modal
          open={profileModalOpen}
          onCancel={() => setProfileModalOpen(false)}
          footer={null}
          width={440}
          closable={false}
          styles={{ body: { padding: '32px 36px 28px' }, content: { borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' } }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1d1d1f', margin: '0 0 24px' }}>
            编辑资料
          </h2>

          {/* 昵称 */}
          <div style={S.modalField}>
            <label style={S.modalLabel}>昵称</label>
            <input
              style={{ ...S.modalInput, borderColor: !editNickname.trim() ? '#ff3b30' : undefined }}
              value={editNickname}
              onChange={(e) => setEditNickname(e.target.value)}
              onFocus={(e) => { e.target.style.borderColor = '#1d1d1f'; e.target.style.background = '#fff'; }}
              onBlur={(e) => { e.target.style.borderColor = '#d2d2d7'; e.target.style.background = '#f5f5f7'; }}
              placeholder="请输入昵称"
            />
          </div>

          {/* 性别 */}
          <div style={S.modalField}>
            <label style={S.modalLabel}>性别</label>
            <div style={S.genderGroup}>
              <button type="button" style={S.genderOption(editGender === 'male')} onClick={() => setEditGender(editGender === 'male' ? '' : 'male')}>
                <ManOutlined /> 男
              </button>
              <button type="button" style={S.genderOption(editGender === 'female')} onClick={() => setEditGender(editGender === 'female' ? '' : 'female')}>
                <WomanOutlined /> 女
              </button>
            </div>
          </div>

          {/* 个性签名 */}
          <div style={S.modalField}>
            <label style={S.modalLabel}>
              个性签名
              <span style={{ fontWeight: 400, color: '#86868b', marginLeft: '8px', fontSize: '12px' }}>
                {editSignature.length}/50
              </span>
            </label>
            <textarea
              style={S.modalTextarea}
              value={editSignature}
              onChange={(e) => setEditSignature(e.target.value.slice(0, 50))}
              onFocus={(e) => { e.target.style.borderColor = '#1d1d1f'; e.target.style.background = '#fff'; }}
              onBlur={(e) => { e.target.style.borderColor = '#d2d2d7'; e.target.style.background = '#f5f5f7'; }}
              placeholder="介绍一下自己"
            />
          </div>

          {/* 按钮 */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
            <button onClick={() => setProfileModalOpen(false)} style={{ ...S.secondaryBtn, flex: 1 }}>
              取消
            </button>
            <button onClick={handleSaveProfile} disabled={saving} style={{ ...S.primaryBtn, flex: 1 }}>
              {saving ? '保存中…' : '保存'}
            </button>
          </div>
        </Modal>

        {/* ========== 2. 订单统计卡片 ========== */}
        <div style={S.statsRow}>
          {statCards.map((stat) => (
            <div key={stat.key} style={S.statCard}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.06)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; }}
            >
              <div style={{ ...S.statIconWrap, background: `${stat.color}14`, color: stat.color }}>
                {stat.icon}
              </div>
              <div style={S.statNumber}>{stat.count}</div>
              <div style={S.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ========== 3. 最近订单卡片 ========== */}
        <div style={{ ...S.card, ...cardHighlight('orders') }} ref={ordersRef}>
          <div style={S.sectionHeader}>
            <div>
              <h2 style={S.sectionTitle}>最近订单</h2>
              <p style={S.sectionSub}>快速查看最近的订单状态</p>
            </div>
            <button
              style={{ ...S.secondaryBtn, border: '1px solid #d2d2d7' }}
              onClick={() => navigate('/orders')}
            >
              查看全部订单
            </button>
          </div>

          {recentOrders.length ? (
            recentOrders.map((order) => (
              <div key={order.id} style={S.orderItem}>
                <div style={S.orderItemLeft}>
                  <div>
                    <span style={S.orderNo}>{order.orderNo}</span>
                    <span style={S.statusBadge(STATUS_COLORS[order.status] || '#86868b')}>
                      {order.status}
                    </span>
                  </div>
                  <span style={S.orderMeta}>下单时间：{order.createdAt}</span>
                </div>

                <span style={S.orderPrice}>{formatPrice(order.totalAmount)}</span>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    style={S.actionBtn}
                    onClick={() => navigate('/order/' + order.id)}
                  >
                    查看详情
                  </button>
                  {order.status === '待付款' && (
                    <button
                      style={{ ...S.actionBtn, background: '#0071e3', color: '#fff', padding: '6px 18px' }}
                      onClick={() => navigate('/pay/' + order.id)}
                    >
                      去支付
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#86868b', fontSize: '14px' }}>
              暂无订单记录
            </div>
          )}
        </div>

        {/* ========== 4. 地址管理卡片 ========== */}
        <div style={{ ...S.card, ...cardHighlight('addresses') }} ref={addressRef}>
          <div style={S.sectionHeader}>
            <div>
              <h2 style={S.sectionTitle}>收货地址</h2>
              <p style={S.sectionSub}>管理您的收货地址</p>
            </div>
            <button
              style={{ ...S.secondaryBtn, border: '1px solid #d2d2d7', background: '#ffffff' }}
              onClick={() => openAddressModal(null)}
            >
              <PlusOutlined style={{ marginRight: '4px', fontSize: 12 }} />
              添加新地址
            </button>
          </div>

          {addresses.length ? (
            <div style={S.addressGrid}>
              {addresses.map((address) => (
                <div key={address.id} style={S.addressCard}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#d2d2d7'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#e5e5e7'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={S.addressName}>
                        {address.receiver}
                      </span>
                      <span style={S.addressPhone}>{address.phone}</span>
                    </div>
                    {address.isDefault && (
                      <span style={S.addressTag(true)}>
                        <CheckCircleOutlined style={{ fontSize: 11, marginRight: '3px' }} />
                        默认地址
                      </span>
                    )}
                  </div>

                  <div style={S.addressDetail}>
                    <EnvironmentOutlined style={{ marginRight: '4px', color: '#86868b', fontSize: 12 }} />
                    {address.region} {address.detail}
                  </div>

                  <span style={{
                    ...S.addressTag(false),
                    fontSize: '11px',
                    padding: '2px 10px',
                  }}>{address.tag}</span>

                  <div style={S.addressActions}>
                    {!address.isDefault && (
                      <button
                        style={S.addressActionLink}
                        onClick={() => { setDefaultAddress(user.id, address.id); message.success('已设置为默认地址'); }}
                      >
                        设为默认
                      </button>
                    )}
                    <button
                      style={S.addressActionLink}
                      onClick={() => openAddressModal(address)}
                    >
                      <EditOutlined style={{ fontSize: 12 }} />编辑
                    </button>
                    <Popconfirm
                      title="确认删除该地址吗？"
                      onConfirm={() => { deleteAddress(address.id); message.success('地址已删除'); }}
                    >
                      <button
                        style={S.addressActionLink}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#ff3b30'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#6e6e73'; }}
                      >
                        <DeleteOutlined style={{ fontSize: 12 }} />删除
                      </button>
                    </Popconfirm>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={S.emptyWrap}>暂无收货地址</div>
          )}
        </div>

        {/* ========== 地址编辑 Modal ========== */}
        <Modal
          open={addrModalOpen}
          onCancel={() => setAddrModalOpen(false)}
          footer={null}
          width={500}
          closable={false}
          styles={{ body: { padding: '32px 36px 28px' }, content: { borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' } }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1d1d1f', margin: '0 0 24px' }}>
            {addrEditing ? '编辑地址' : '新增地址'}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#1d1d1f', marginBottom: '6px', display: 'block' }}>收货人</label>
              <input
                style={{ ...S.modalInput, width: '100%' }}
                placeholder="收货人姓名"
                value={addrReceiver}
                onChange={(e) => setAddrReceiver(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#1d1d1f', marginBottom: '6px', display: 'block' }}>手机号</label>
              <input
                style={{ ...S.modalInput, width: '100%' }}
                placeholder="11位手机号"
                value={addrPhone}
                onChange={(e) => setAddrPhone(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#1d1d1f', marginBottom: '6px', display: 'block' }}>城市</label>
              <input
                style={{ ...S.modalInput, width: '100%' }}
                placeholder="省/市/区"
                value={addrRegion}
                onChange={(e) => setAddrRegion(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#1d1d1f', marginBottom: '6px', display: 'block' }}>详细地址</label>
              <input
                style={{ ...S.modalInput, width: '100%' }}
                placeholder="街道、门牌号等"
                value={addrDetail}
                onChange={(e) => setAddrDetail(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#1d1d1f', marginBottom: '6px', display: 'block' }}>地址标签</label>
            <input
              style={{ ...S.modalInput, width: '200px' }}
              placeholder="如：家、公司"
              value={addrTag}
              onChange={(e) => setAddrTag(e.target.value)}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', cursor: 'pointer', fontSize: '14px', color: '#515154' }}>
            <input
              type="checkbox" checked={addrIsDefault}
              onChange={(e) => setAddrIsDefault(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#0071e3' }}
            />
            设为默认地址
          </label>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setAddrModalOpen(false)} style={{ ...S.secondaryBtn, flex: 1 }}>
              取消
            </button>
            <button onClick={handleSaveAddress} style={{ ...S.primaryBtn, flex: 1 }}>
              保存地址
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
