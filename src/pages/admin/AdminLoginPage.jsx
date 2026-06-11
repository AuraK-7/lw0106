import { Button, Card, Form, Input, Space, Typography, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { passwordRules, requiredRule } from '../../utils/validators';

// 后台独立登录页，仅管理员可进入。
export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAdmin();
  const redirectTo = location.state?.from?.pathname || '/admin';

  async function handleFinish(values) {
    try { await login(values); message.success('后台登录成功'); setTimeout(function () { navigate(redirectTo, { replace: true }); }, 0); } catch (error) { message.error(error.message); }
  }

  return (
    <div className="auth-page"><Card className="auth-card admin-auth-card"><Typography.Title level={2}>商城后台管理端</Typography.Title><Typography.Paragraph type="secondary">超级管理员可访问全部模块，普通运营只能访问授权模块。</Typography.Paragraph><Form layout="vertical" onFinish={handleFinish}><Form.Item label="管理员账号" name="username" rules={[requiredRule('管理员账号')]}><Input placeholder="请输入管理员账号" /></Form.Item><Form.Item label="密码" name="password" rules={passwordRules}><Input.Password placeholder="请输入管理员密码" /></Form.Item><Button block htmlType="submit" type="primary">登录后台</Button></Form><Card className="tips-card" size="small"><Space direction="vertical"><Typography.Text>超级管理员：admin / admin123</Typography.Text><Typography.Text>普通运营：operator / operator123</Typography.Text></Space></Card></Card></div>
  );
}
