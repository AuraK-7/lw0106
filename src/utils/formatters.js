export function formatPrice(value) {
  return '¥' + Number(value || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatDate(value) {
  if (!value) return '--';
  return String(value).replace('T', ' ').slice(0, 19);
}

export function getStatusColor(status) {
  const colorMap = { 待付款: 'orange', 待发货: 'geekblue', 待收货: 'green', 已完成: 'purple', 已取消: 'red' };
  return colorMap[status] || 'default';
}

export function getPermissionLabel(permission) {
  const labelMap = { dashboard: '控制台', products: '商品管理', categories: '分类管理', orders: '订单管理', permissions: '权限管理' };
  return labelMap[permission] || permission;
}

export function buildOrderSummary(items) {
  return items.reduce(function (summary, item) {
    summary.totalQuantity += item.quantity;
    summary.totalAmount += item.product.price * item.quantity;
    return summary;
  }, { totalQuantity: 0, totalAmount: 0 });
}
