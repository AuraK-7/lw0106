import { message } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  IdcardOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  LoadingOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  SmileOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

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
  // ---- 标题区 ----
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
  // ---- 卡片 ----
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
  // ---- 表单 ----
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
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: '#86868b',
    fontSize: '18px',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    zIndex: 1,
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
  // ---- 密码强度 ----
  strengthRow: {
    display: 'flex',
    gap: '6px',
    marginTop: '8px',
    alignItems: 'center',
  },
  strengthBar: (active, color) => ({
    flex: 1,
    height: '4px',
    borderRadius: '2px',
    background: active ? color : '#e8e8ed',
    transition: 'background 0.3s',
  }),
  strengthText: {
    fontSize: '12px',
    fontWeight: 500,
    marginTop: '4px',
  },
  inlineCheck: (ok) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: ok ? '#34c759' : '#86868b',
    marginTop: '6px',
  }),
  // ---- 错误 ----
  errorText: {
    fontSize: '13px',
    color: '#ff3b30',
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  // ---- 底部切换链接 ----
  switchRow: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '14px',
    color: '#6e6e73',
  },
  switchLink: {
    color: '#0071e3',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontSize: '14px',
    fontFamily: 'inherit',
    padding: 0,
    fontWeight: 500,
  },
};

// ==================== 密码强度计算 ====================
function getPasswordStrength(password) {
  if (!password) return { level: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[a-zA-Z]/.test(password) && /\d/.test(password)) score++;
  if (/[^a-zA-Z\d]/.test(password)) score++;
  if (score <= 1) return { level: 1, label: '弱', color: '#ff3b30' };
  if (score === 2) return { level: 2, label: '中', color: '#ff9500' };
  return { level: 3, label: '强', color: '#34c759' };
}

// ==================== 登录/注册内容组件 ====================
export default function UserAuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useUser();
  const redirectTo = location.state?.from?.pathname || '/';

  // ---- 模式 ----
  const [mode, setMode] = useState('login');
  const [loggingIn, setLoggingIn] = useState(false);
  const [pwdVisible, setPwdVisible] = useState(false);

  // 登录字段
  const [loginAccount, setLoginAccount] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState({});

  // 注册字段
  const [regUsername, setRegUsername] = useState('');
  const [regNickname, setRegNickname] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPwd, setRegConfirmPwd] = useState('');
  const [regPwdVisible, setRegPwdVisible] = useState(false);
  const [regConfirmPwdVisible, setRegConfirmPwdVisible] = useState(false);
  const [regErrors, setRegErrors] = useState({});

  // ---- 挂载时覆盖 .page-content 灰色背景为白色，卸载时还原 ----
  useEffect(() => {
    const el = document.querySelector('.page-content');
    if (!el) return;
    const prev = el.style.background;
    el.style.background = '#ffffff';
    return () => { el.style.background = prev; };
  }, []);

  // ---- 校验 ----
  function validateLogin() {
    const errors = {};
    if (!loginAccount.trim()) errors.account = '请输入账号或手机号';
    if (!loginPassword) errors.password = '请输入密码';
    else if (loginPassword.length < 6) errors.password = '密码长度不能少于 6 位';
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  }
  function validateRegister() {
    const errors = {};
    if (!regUsername.trim()) errors.username = '请输入用户名';
    if (!regNickname.trim()) errors.nickname = '请输入昵称';
    if (!regPhone.trim()) errors.phone = '请输入手机号';
    else if (!/^1\d{10}$/.test(regPhone)) errors.phone = '请输入正确的 11 位手机号';
    if (!regPassword) errors.password = '请输入密码';
    else if (regPassword.length < 6) errors.password = '密码长度不能少于 6 位';
    if (!regConfirmPwd) errors.confirmPassword = '请确认密码';
    else if (regPassword !== regConfirmPwd) errors.confirmPassword = '两次输入的密码不一致';
    setRegErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // ---- 提交 ----
  async function handleLogin(e) {
    e.preventDefault();
    if (!validateLogin()) return;
    setLoggingIn(true);
    try {
      await login({ account: loginAccount.trim(), password: loginPassword });
      message.success('登录成功');
      navigate(redirectTo, { replace: true });
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoggingIn(false);
    }
  }
  async function handleRegister(e) {
    e.preventDefault();
    if (!validateRegister()) return;
    try {
      await register({
        username: regUsername.trim(),
        nickname: regNickname.trim(),
        phone: regPhone.trim(),
        password: regPassword,
      });
      message.success('注册成功，已自动登录');
      navigate(redirectTo, { replace: true });
    } catch (error) {
      message.error(error.message);
    }
  }

  // ---- 辅助 ----
  const pwdStrength = getPasswordStrength(regPassword);
  const phoneValid = regPhone ? /^1\d{10}$/.test(regPhone) : null;
  const confirmMatch = regConfirmPwd ? regPassword === regConfirmPwd : null;

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
  function clearLoginError(field) {
    setLoginErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
  }
  function clearRegError(field) {
    setRegErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
  }

  // ---- 切换模式 ----
  function switchToLogin() { setMode('login'); setLoginErrors({}); }
  function switchToRegister() { setMode('register'); setRegErrors({}); }

  return (
    <div style={S.wrapper}>
      <div style={S.content}>

        {/* 标题 */}
        <h1 style={S.title}>
          {mode === 'login' ? '登录你的星舟商城账户' : '创建新账户'}
        </h1>
        <p style={S.subtitle}>
          {mode === 'login'
            ? '查看订单、管理地址和个人资料'
            : '注册后即可访问购物车、下单、支付与个人中心'}
        </p>

        {/* ======== 登录 / 注册卡片 ======== */}
        <div style={S.card}>

          {mode === 'login' && (
            <>
              <h2 style={S.cardTitle}>登录</h2>
              <form onSubmit={handleLogin}>
                {/* 账号 */}
                <div style={S.formItem}>
                  <label style={S.label}>账号或手机号</label>
                  <div style={S.inputWrap}>
                    <span style={S.prefixIcon}><UserOutlined /></span>
                    <input
                      style={{ ...S.input, borderColor: loginErrors.account ? '#ff3b30' : undefined, background: loginErrors.account ? '#fff5f5' : undefined }}
                      type="text" placeholder="请输入用户名或手机号"
                      value={loginAccount}
                      onChange={(e) => { setLoginAccount(e.target.value); clearLoginError('account'); }}
                      onFocus={onFocus} onBlur={onBlur}
                      autoComplete="username"
                    />
                  </div>
                  {loginErrors.account && <div style={S.errorText}><CloseCircleFilled />{loginErrors.account}</div>}
                </div>

                {/* 密码 */}
                <div style={S.formItem}>
                  <label style={S.label}>密码</label>
                  <div style={S.inputWrap}>
                    <span style={S.prefixIcon}><LockOutlined /></span>
                    <input
                      style={{ ...S.input, borderColor: loginErrors.password ? '#ff3b30' : undefined, background: loginErrors.password ? '#fff5f5' : undefined }}
                      type={pwdVisible ? 'text' : 'password'} placeholder="请输入密码"
                      value={loginPassword}
                      onChange={(e) => { setLoginPassword(e.target.value); clearLoginError('password'); }}
                      onFocus={onFocus} onBlur={onBlur}
                      autoComplete="current-password"
                    />
                    <button type="button" style={S.eyeBtn} onClick={() => setPwdVisible(!pwdVisible)} tabIndex={-1}>
                      {pwdVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    </button>
                  </div>
                  {loginErrors.password && <div style={S.errorText}><CloseCircleFilled />{loginErrors.password}</div>}
                </div>

                <button type="submit" style={S.primaryBtn(loggingIn)} disabled={loggingIn}>
                  {loggingIn && <LoadingOutlined />}
                  {loggingIn ? '登录中…' : '登录'}
                </button>
              </form>
            </>
          )}

          {mode === 'register' && (
            <>
              <h2 style={S.cardTitle}>注册</h2>
              <form onSubmit={handleRegister}>
                {/* 用户名 */}
                <div style={S.formItem}>
                  <label style={S.label}>用户名</label>
                  <div style={S.inputWrap}>
                    <span style={S.prefixIcon}><IdcardOutlined /></span>
                    <input
                      style={{ ...S.input, borderColor: regErrors.username ? '#ff3b30' : undefined, background: regErrors.username ? '#fff5f5' : undefined }}
                      type="text" placeholder="请输入用户名"
                      value={regUsername}
                      onChange={(e) => { setRegUsername(e.target.value); clearRegError('username'); }}
                      onFocus={onFocus} onBlur={onBlur}
                      autoComplete="username"
                    />
                  </div>
                  {regErrors.username && <div style={S.errorText}><CloseCircleFilled />{regErrors.username}</div>}
                </div>

                {/* 昵称 */}
                <div style={S.formItem}>
                  <label style={S.label}>昵称</label>
                  <div style={S.inputWrap}>
                    <span style={S.prefixIcon}><SmileOutlined /></span>
                    <input
                      style={{ ...S.input, borderColor: regErrors.nickname ? '#ff3b30' : undefined, background: regErrors.nickname ? '#fff5f5' : undefined }}
                      type="text" placeholder="请输入昵称"
                      value={regNickname}
                      onChange={(e) => { setRegNickname(e.target.value); clearRegError('nickname'); }}
                      onFocus={onFocus} onBlur={onBlur}
                    />
                  </div>
                  {regErrors.nickname && <div style={S.errorText}><CloseCircleFilled />{regErrors.nickname}</div>}
                </div>

                {/* 手机号 */}
                <div style={S.formItem}>
                  <label style={S.label}>手机号</label>
                  <div style={S.inputWrap}>
                    <span style={S.prefixIcon}><PhoneOutlined /></span>
                    <input
                      style={{ ...S.input, borderColor: regErrors.phone ? '#ff3b30' : undefined, background: regErrors.phone ? '#fff5f5' : undefined }}
                      type="text" placeholder="请输入手机号"
                      value={regPhone}
                      onChange={(e) => { setRegPhone(e.target.value.replace(/\D/g, '')); clearRegError('phone'); }}
                      onFocus={onFocus} onBlur={onBlur}
                      maxLength={11} autoComplete="tel"
                    />
                  </div>
                  {regErrors.phone ? (
                    <div style={S.errorText}><CloseCircleFilled />{regErrors.phone}</div>
                  ) : phoneValid !== null && (
                    <div style={S.inlineCheck(phoneValid)}>
                      {phoneValid ? <CheckCircleFilled /> : <CloseCircleFilled />}
                      {phoneValid ? '手机号格式正确' : '请输入正确的 11 位手机号'}
                    </div>
                  )}
                </div>

                {/* 密码 */}
                <div style={S.formItem}>
                  <label style={S.label}>密码</label>
                  <div style={S.inputWrap}>
                    <span style={S.prefixIcon}><LockOutlined /></span>
                    <input
                      style={{ ...S.input, borderColor: regErrors.password ? '#ff3b30' : undefined, background: regErrors.password ? '#fff5f5' : undefined }}
                      type={regPwdVisible ? 'text' : 'password'} placeholder="请输入密码"
                      value={regPassword}
                      onChange={(e) => { setRegPassword(e.target.value); clearRegError('password'); }}
                      onFocus={onFocus} onBlur={onBlur}
                      autoComplete="new-password"
                    />
                    <button type="button" style={S.eyeBtn} onClick={() => setRegPwdVisible(!regPwdVisible)} tabIndex={-1}>
                      {regPwdVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    </button>
                  </div>
                  {regErrors.password ? (
                    <div style={S.errorText}><CloseCircleFilled />{regErrors.password}</div>
                  ) : regPassword && (
                    <>
                      <div style={S.strengthRow}>
                        <div style={S.strengthBar(pwdStrength.level >= 1, pwdStrength.color)} />
                        <div style={S.strengthBar(pwdStrength.level >= 2, pwdStrength.color)} />
                        <div style={S.strengthBar(pwdStrength.level >= 3, pwdStrength.color)} />
                      </div>
                      <div style={{ ...S.strengthText, color: pwdStrength.color }}>
                        {regPassword.length < 6 ? '至少 6 个字符' : `密码强度：${pwdStrength.label}`}
                      </div>
                      <div style={S.inlineCheck(regPassword.length >= 6)}>
                        {regPassword.length >= 6 ? <CheckCircleFilled /> : <CloseCircleFilled />}
                        不少于 6 位
                      </div>
                    </>
                  )}
                </div>

                {/* 确认密码 */}
                <div style={S.formItem}>
                  <label style={S.label}>确认密码</label>
                  <div style={S.inputWrap}>
                    <span style={S.prefixIcon}><LockOutlined /></span>
                    <input
                      style={{ ...S.input, borderColor: regErrors.confirmPassword ? '#ff3b30' : undefined, background: regErrors.confirmPassword ? '#fff5f5' : undefined }}
                      type={regConfirmPwdVisible ? 'text' : 'password'} placeholder="请再次输入密码"
                      value={regConfirmPwd}
                      onChange={(e) => { setRegConfirmPwd(e.target.value); clearRegError('confirmPassword'); }}
                      onFocus={onFocus} onBlur={onBlur}
                      autoComplete="new-password"
                    />
                    <button type="button" style={S.eyeBtn} onClick={() => setRegConfirmPwdVisible(!regConfirmPwdVisible)} tabIndex={-1}>
                      {regConfirmPwdVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    </button>
                  </div>
                  {regErrors.confirmPassword ? (
                    <div style={S.errorText}><CloseCircleFilled />{regErrors.confirmPassword}</div>
                  ) : regConfirmPwd && (
                    <div style={S.inlineCheck(confirmMatch)}>
                      {confirmMatch ? <CheckCircleFilled /> : <CloseCircleFilled />}
                      {confirmMatch ? '密码一致' : '两次输入的密码不一致'}
                    </div>
                  )}
                </div>

                <button type="submit" style={S.primaryBtn(false)}>创建账户</button>
              </form>
            </>
          )}
        </div>

        {/* ======== 切换链接 ======== */}
        <div style={S.switchRow}>
          {mode === 'login' ? (
            <>没有账号？<button style={S.switchLink} onClick={switchToRegister}>立即注册</button></>
          ) : (
            <>已有账号？<button style={S.switchLink} onClick={switchToLogin}>立即登录</button></>
          )}
        </div>

      </div>
    </div>
  );
}
