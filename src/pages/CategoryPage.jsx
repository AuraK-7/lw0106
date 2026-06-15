import { Empty, Pagination, Select, Space, Tag, Typography } from 'antd';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { useMallData } from '../hooks/useMallData';
import { usePagination } from '../hooks/usePagination';
import { getCategories, getProducts } from '../utils/mallStore';

export default function CategoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, pageSize, setPage } = usePagination(8);
  const keyword = searchParams.get('keyword') || '';
  const categoryId = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'sales';
  const categories = useMallData(function () { return getCategories(); }, []);
  const result = useMallData(function () {
    return getProducts({ keyword, categoryId, sort, page, pageSize });
  }, [keyword, categoryId, sort, page, pageSize]);

  useEffect(function () {
    setPage(1);
  }, [categoryId, keyword, sort, setPage]);

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  }

  return (
    <div className="category-page">
      <section className="category-hero">
        <SearchBar
          defaultValue={keyword}
          onSearch={function (value) { updateParam('keyword', value); }}
        />
      </section>

      <section className="category-filter">
        <Space wrap className="tag-group">
          <Tag.CheckableTag checked={categoryId === 'all'} onChange={function () { updateParam('category', 'all'); }}>
            全部分类
          </Tag.CheckableTag>
          {categories.map(function (category) {
            return (
              <Tag.CheckableTag
                checked={categoryId === category.id}
                key={category.id}
                onChange={function () { updateParam('category', category.id); }}
              >
                {category.name}
                <span className="tag-count">{category.productCount}</span>
              </Tag.CheckableTag>
            );
          })}
        </Space>
        <Select
          className="category-sort"
          options={[
            { label: '销量优先', value: 'sales' },
            { label: '新品优先', value: 'new' },
            { label: '价格从低到高', value: 'priceAsc' },
            { label: '价格从高到低', value: 'priceDesc' },
          ]}
          value={sort}
          onChange={function (value) { updateParam('sort', value); }}
        />
      </section>

      <section className="category-result">
        <div className="category-result-head">
          <Typography.Text>共找到 <strong>{result.total}</strong> 件商品</Typography.Text>
          {keyword ? <Tag closable onClose={function () { updateParam('keyword', ''); }}>关键词：{keyword}</Tag> : null}
        </div>
        {result.list.length ? (
          <>
            <div className="product-grid">
              {result.list.map(function (product) {
                return <ProductCard key={product.id} product={product} />;
              })}
            </div>
            <div className="pagination-wrap">
              <Pagination
                current={page}
                pageSize={pageSize}
                showSizeChanger={false}
                total={result.total}
                onChange={function (nextPage) { setPage(nextPage); }}
              />
            </div>
          </>
        ) : (
          <Empty description="暂无符合条件的商品" />
        )}
      </section>
    </div>
  );
}
