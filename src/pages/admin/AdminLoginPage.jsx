import {
  InfoCircleOutlined,
  LeftOutlined,
  LockOutlined,
  LoadingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { message } from 'antd';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';

// ==================== 内联样式 ====================
const S = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: '64px 24px 80px',
    background: '#ffffff',
  },
  content: {
    width: '100%',
    maxWidth: '520px',
  },
  backRow: {
    marginBottom: '24px',
  },
  backLink: {
    fontSize: '14px',
    color: '#0071e3',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: 'none',
    border: 'none',
    padding: 0,
    fontFamily: 'inherit',
  },
  title: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#1d1d1f',
    letterSpacing: '-0.6px',
    margin: 0,
    lineHeight: 1.15,
  },
  subtitle: {
    fontSize: '16px',
    color: '#6e6e73',
    marginTop: '8px',
    lineHeight: 1.5,
  },
  card: {
    marginTop: '32px',
    background: '#fff',
    borderRadius: '20px',
    border: '1px solid #e5e5e7',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    padding: '40px',
  },
  cardTitle: {
    fontSize: '17px',
    fontWeight: 600,
    color: '#1d1d1f',
    margin: 0,
    marginBottom: '28px',
  },
  formItem: {
    marginBottom: '20px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#1d1d1f',
    marginBottom: '6px',
    display: 'block',
  },
  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  prefixIcon: {
    position: 'absolute',
    left: '16px',
    zIndex: 1,
    fontSize: '18px',
    color: '#86868b',
    pointerEvents: 'none',
    display: 'flex',
  },
  input: {
    width: '100%',
    height: '50px',
    padding: '0 44px 0 44px',
    borderRadius: '14px',
    border: '1px solid #d2d2d7',
    fontSize: '16px',
    color: '#1d1d1f',
    background: '#f5f5f7',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
  },
  primaryBtn: (loading) => ({
    width: '100%',
    height: '50px',
    borderRadius: '14px',
    border: 'none',
    background: loading ? '#aaa' : '#1d1d1f',
    color: '#fff',
    fontSize: '17px',
    fontWeight: 600,
    cursor: loading ? 'not-allowed' : 'pointer',
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'background 0.2s, opacity 0.2s',
    letterSpacing: '-0.2px',
  }),
  errorText: {
    fontSize: '13px',
    color: '#ff3b30',
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  // ---- 测试账号提示卡片 ----
  tipsCard: {
    marginTop: '28px',
    background: '#f9f9fb',
    borderRadius: '14px',
    border: '1px solid #e8e8ed',
    padding: '20px 24px',
  },
  tipsTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#6e6e73',
    margin: 0,
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  tipsRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  tipItem: {
    fontSize: '13px',
    color: '#86868b',
    lineHeight: 1.5,
  },
  tipCode: {
    display: 'inline-block',
    background: '#e8e8ed',
    borderRadius: '4px',
    padding: '1px 6px',
    fontSize: '12px',
    fontFamily: 'SF Mono, Menlo, monospace',
    color: '#1d1d1f',
    margin: '0 2px',
  },
};

// ==================== 后台登录页 ====================
export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAdmin();
  const redirectTo = location.state?.from?.pathname || '/admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [errors, setErrors] = useState({});

  // ---- 挂载时覆盖 .page-content 灰色背景为白色，卸载时还原 ----
  useEffect(() => {
    const el = document.querySelector('.page-content');
    if (!el) return;
    const prev = el.style.background;
    el.style.background = '#ffffff';
    return () => { el.style.background = prev; };
  }, []);

  function validate() {
    const errs = {};
    if (!username.trim()) errs.username = '请输入管理员账号';
    if (!password) errs.password = '请输入密码';
    else if (password.length < 6) errs.password = '密码长度不能少于 6 位';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoggingIn(true);
    try {
      await login({ username: username.trim(), password });
      message.success('后台登录成功');
      setTimeout(() => { navigate(redirectTo, { replace: true }); }, 0);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoggingIn(false);
    }
  }

  function clearError(field) {
    setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
  }

  const onFocus = (e) => {
    e.target.style.borderColor = '#1d1d1f';
    e.target.style.background = '#fff';
    e.target.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.04)';
  };
  const onBlur = (e) => {
    e.target.style.borderColor = '#d2d2d7';
    e.target.style.background = '#f5f5f7';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={S.wrapper}>
      <div style={S.content}>

        {/* 返回首页 */}
        <div style={S.backRow}>
          <button onClick={() => navigate('/')} style={S.backLink}>
            <LeftOutlined style={{ fontSize: 12 }} />
            返回首页
          </button>
        </div>

        {/* 标题 */}
        <h1 style={S.title}>登录商城后台管理端</h1>
        <p style={S.subtitle}>管理商品、订单、分类与运营数据</p>

        {/* ======== 登录卡片 ======== */}
        <div style={S.card}>
          <h2 style={S.cardTitle}>管理员登录</h2>
          <form onSubmit={handleSubmit}>

            {/* 账号 */}
            <div style={S.formItem}>
              <label style={S.label}>管理员账号</label>
              <div style={S.inputWrap}>
                <span style={S.prefixIcon}><UserOutlined /></span>
                <input
                  style={{ ...S.input, borderColor: errors.username ? '#ff3b30' : undefined, background: errors.username ? '#fff5f5' : undefined }}
                  type="text"
                  placeholder="请输入管理员账号"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); clearError('username'); }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  autoComplete="username"
                />
              </div>
              {errors.username && <div style={S.errorText}>{errors.username}</div>}
            </div>

            {/* 密码 */}
            <div style={S.formItem}>
              <label style={S.label}>密码</label>
              <div style={S.inputWrap}>
                <span style={S.prefixIcon}><LockOutlined /></span>
                <input
                  style={{ ...S.input, borderColor: errors.password ? '#ff3b30' : undefined, background: errors.password ? '#fff5f5' : undefined }}
                  type="password"
                  placeholder="请输入管理员密码"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  autoComplete="current-password"
                />
              </div>
              {errors.password && <div style={S.errorText}>{errors.password}</div>}
            </div>

            <button type="submit" style={S.primaryBtn(loggingIn)} disabled={loggingIn}>
              {loggingIn && <LoadingOutlined />}
              {loggingIn ? '登录中…' : '登录后台'}
            </button>
          </form>
        </div>

        {/* ======== 测试账号提示 ======== */}
        <div style={S.tipsCard}>
          <p style={S.tipsTitle}>
            <InfoCircleOutlined style={{ fontSize: 14 }} />
            测试账号
          </p>
          <div style={S.tipsRow}>
            <div style={S.tipItem}>
              超级管理员：<code style={S.tipCode}>admin</code> / <code style={S.tipCode}>admin123</code>
            </div>
            <div style={S.tipItem}>
              普通运营：<code style={S.tipCode}>operator</code> / <code style={S.tipCode}>operator123</code>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
