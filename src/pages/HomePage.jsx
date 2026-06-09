import { Button, Card, Col, Row, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import { useMallData } from '../hooks/useMallData';
import { getBanners, getCategories, getHotProducts } from '../utils/mallStore';

// 前台首页，展示搜索入口、轮播图、分类推荐和热门商品。
export default function HomePage() {
  const navigate = useNavigate();
  const banners = useMallData(function () { return getBanners(); }, []);
  const categories = useMallData(function () { return getCategories().slice(0, 5); }, []);
  const hotProducts = useMallData(function () { return getHotProducts(8); }, []);

  return (
    <div className="page-section-stack">
      <HeroCarousel banners={banners} />
      <Card className="section-card">
        <div className="section-header">
          <div>
            <Typography.Title level={3}>热门分类</Typography.Title>
            <Typography.Text type="secondary">快速进入你感兴趣的品类专区</Typography.Text>
          </div>
          <Button type="link" onClick={function () { navigate('/category'); }}>查看全部分类</Button>
        </div>
        <Row gutter={[16, 16]}>
          {categories.map(function (category) {
            return (
              <Col key={category.id} lg={4} md={8} sm={12} xs={24}>
                <Card hoverable className="category-card" cover={<img alt={category.name} className="category-cover" src={category.cover} />} onClick={function () { navigate('/category?category=' + category.id); }}>
                  <Typography.Title level={5}>{category.name}</Typography.Title>
                  <Typography.Paragraph ellipsis={{ rows: 2 }} type="secondary">{category.description}</Typography.Paragraph>
                  <Typography.Text type="secondary">商品数量：{category.productCount}</Typography.Text>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Card>
      <Card className="section-card">
        <div className="section-header">
          <div>
            <Typography.Title level={3}>热门商品</Typography.Title>
            <Typography.Text type="secondary">根据销量推荐的高关注单品</Typography.Text>
          </div>
          <Space>
            <Button onClick={function () { navigate('/category?keyword=智能'); }}>浏览智能专区</Button>
            <Button type="primary" onClick={function () { navigate('/category'); }}>前往商品列表</Button>
          </Space>
        </div>
        <Row gutter={[16, 16]}>
          {hotProducts.map(function (product) {
            return <Col key={product.id} lg={6} md={8} sm={12} xs={24}><ProductCard product={product} /></Col>;
          })}
        </Row>
      </Card>
    </div>
  );
}
