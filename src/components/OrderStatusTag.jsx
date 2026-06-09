import { Tag } from 'antd';
import { getStatusColor } from '../utils/formatters';

// 订单状态标签组件。
export default function OrderStatusTag({ status }) {
  return <Tag color={getStatusColor(status)}>{status}</Tag>;
}
