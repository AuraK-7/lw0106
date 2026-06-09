import { Input } from 'antd';

// 公共搜索框组件，前台首页和分类页共用。
export default function SearchBar({ defaultValue, onSearch, placeholder = '搜索商品关键词' }) {
  return <Input.Search allowClear defaultValue={defaultValue} enterButton="搜索" placeholder={placeholder} size="large" onSearch={onSearch} />;
}
