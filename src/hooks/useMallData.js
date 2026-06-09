import { useEffect, useState } from 'react';
import { subscribeMallChange } from '../utils/mallStore';

// 用于读取本地仓库快照并在数据变更时自动刷新页面。
export function useMallData(factory, dependencies = []) {
  const [data, setData] = useState(function () {
    return factory();
  });

  useEffect(function () {
    setData(factory());
    return subscribeMallChange(function () {
      setData(factory());
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return data;
}
