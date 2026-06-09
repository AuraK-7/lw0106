import { Button, Card, Form, Input, Tabs, Typography, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { confirmPasswordRule, passwordRules, phoneRules, requiredRule } from '../utils/validators';

// 前台登录与注册页。
export default function UserAuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useUser();
  const redirectTo = location.state?.from?.pathname || '/';
  const [registerForm] = Form.useForm();

  async function handleLogin(values) {
    try { await login(values); message.success('登录成功'); navigate(redirectTo, { replace: true }); } catch (error) { message.error(error.message); }
  }
  async function handleRegister(values) {
    try { await register(values); message.success('注册成功，已自动登录'); navigate(redirectTo, { replace: true }); } catch (error) { message.error(error.message); }
  }

  return (
    <div className="auth-page"><Card className="auth-card"><Typography.Title level={2}>欢迎来到星舟商城</Typography.Title><Typography.Paragraph type="secondary">登录后即可访问购物车、下单、支付与个人中心等完整流程。</Typography.Paragraph><Tabs defaultActiveKey="login" items={[{ key: 'login', label: '用户登录', children: <Form layout="vertical" onFinish={handleLogin}><Form.Item label="账号/手机号" name="account" rules={[requiredRule('账号或手机号')]}><Input placeholder="请输入用户名或手机号" /></Form.Item><Form.Item label="密码" name="password" rules={passwordRules}><Input.Password placeholder="请输入密码" /></Form.Item><Button block htmlType="submit" type="primary">立即登录</Button></Form> }, { key: 'register', label: '用户注册', children: <Form form={registerForm} layout="vertical" onFinish={handleRegister}><Form.Item label="用户名" name="username" rules={[requiredRule('用户名')]}><Input placeholder="请输入用户名" /></Form.Item><Form.Item label="昵称" name="nickname" rules={[requiredRule('昵称')]}><Input placeholder="请输入昵称" /></Form.Item><Form.Item label="手机号" name="phone" rules={phoneRules}><Input placeholder="请输入手机号" /></Form.Item><Form.Item label="密码" name="password" rules={passwordRules}><Input.Password placeholder="请输入密码" /></Form.Item><Form.Item dependencies={['password']} label="确认密码" name="confirmPassword" rules={[requiredRule('确认密码'), confirmPasswordRule(registerForm)]}><Input.Password placeholder="请再次输入密码" /></Form.Item><Button block htmlType="submit" type="primary">注册并登录</Button></Form> }]} /></Card></div>
  );
}
