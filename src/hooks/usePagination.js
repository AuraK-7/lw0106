import { useMemo, useState } from 'react';

// 简单分页 Hook，统一列表页分页状态管理。
export function usePagination(defaultPageSize = 8) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const pagination = useMemo(function () {
    return {
      current: page,
      pageSize,
      showSizeChanger: false,
      onChange(nextPage, nextPageSize) {
        setPage(nextPage);
        setPageSize(nextPageSize);
      },
    };
  }, [page, pageSize]);

  return { page, pageSize, setPage, setPageSize, pagination };
}
