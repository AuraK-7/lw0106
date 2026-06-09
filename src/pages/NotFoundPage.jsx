import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

// 通用 404 页面。
export default function NotFoundPage() {
  const navigate = useNavigate();
  return <Result extra={[<Button key="home" type="primary" onClick={function () { navigate('/'); }}>返回首页</Button>]} status="404" subTitle="你访问的页面不存在。" title="页面未找到" />;
}
