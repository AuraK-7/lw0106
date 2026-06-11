import { Input } from 'antd';

export default function SearchBar({ defaultValue, onSearch, placeholder = '搜索商品' }) {
  return (
    <Input.Search
      allowClear
      defaultValue={defaultValue}
      enterButton={null}
      placeholder={placeholder}
      size="small"
      onSearch={onSearch}
      style={{ height: 32 }}
    />
  );
}
