import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { useEffect, useState } from 'react';

export default function SearchBar({ defaultValue = '', onSearch, placeholder = '搜索商品、品类或关键词' }) {
  const [value, setValue] = useState(defaultValue);

  useEffect(function () {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <Input.Search
      allowClear
      enterButton={<SearchOutlined />}
      placeholder={placeholder}
      size="large"
      value={value}
      onChange={function (event) { setValue(event.target.value); }}
      onSearch={function (nextValue) { onSearch(nextValue.trim()); }}
    />
  );
}
