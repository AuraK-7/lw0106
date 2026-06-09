import { Card, Col, Empty, Pagination, Row, Space, Tag, Typography } from 'antd';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { useMallData } from '../hooks/useMallData';
import { usePagination } from '../hooks/usePagination';
import { getCategories, getProducts } from '../utils/mallStore';

// 分类页支持分类筛选、关键词搜索和分页展示。
export default function CategoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, pageSize, setPage } = usePagination(8);
  const keyword = searchParams.get('keyword') || '';
  const categoryId = searchParams.get('category') || 'all';

  useEffect(function () { setPage(1); }, [categoryId, keyword, setPage]);
  const categories = useMallData(function () { return getCategories(); }, []);
  const result = useMallData(function () { return getProducts({ keyword, categoryId, page, pageSize }); }, [keyword, categoryId, page, pageSize]);

  return (
    <div className="page-section-stack">
      <Card className="section-card">
        <div className="section-header">
          <div>
            <Typography.Title level={3}>商品分类</Typography.Title>
            <Typography.Text type="secondary">支持关键词搜索、分类筛选与分页浏览</Typography.Text>
          </div>
        </div>
        <SearchBar defaultValue={keyword} onSearch={function (value) { const next = new URLSearchParams(searchParams); if (value) { next.set('keyword', value); } else { next.delete('keyword'); } setSearchParams(next); }} />
        <Space wrap className="tag-group">
          <Tag.CheckableTag checked={categoryId === 'all'} onChange={function () { const next = new URLSearchParams(searchParams); next.delete('category'); setSearchParams(next); }}>全部分类</Tag.CheckableTag>
          {categories.map(function (category) {
            return <Tag.CheckableTag key={category.id} checked={categoryId === category.id} onChange={function () { const next = new URLSearchParams(searchParams); next.set('category', category.id); setSearchParams(next); }}>{category.name}</Tag.CheckableTag>;
          })}
        </Space>
      </Card>
      <Card className="section-card">
        <div className="section-header"><Typography.Text>当前共找到 <strong>{result.total}</strong> 件商品</Typography.Text></div>
        {result.list.length ? (
          <>
            <Row gutter={[16, 16]}>{result.list.map(function (product) { return <Col key={product.id} lg={6} md={8} sm={12} xs={24}><ProductCard product={product} /></Col>; })}</Row>
            <div className="pagination-wrap"><Pagination current={page} pageSize={pageSize} showSizeChanger={false} total={result.total} onChange={function (nextPage) { setPage(nextPage); }} /></div>
          </>
        ) : <Empty description="暂无符合条件的商品" />}
      </Card>
    </div>
  );
}
