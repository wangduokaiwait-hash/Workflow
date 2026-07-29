import { memo } from 'react';
import styles from './AddressBadge.module.css';

export interface AddressBadgeProps {
  /** Badge 文本(例如: 04:59 后餐厅停止接单) */
  text: string;
}

/**
 * 特殊 Badge
 * - 边框: 1px solid #FF7A7A
 * - 文字: #FF4D4F
 * - 背景: 白色
 * - 字体: 12px
 * - Padding: 2px 6px
 * - 圆角: 4px
 * - 始终完整显示, 不被省略
 */
const AddressBadge = ({ text }: AddressBadgeProps) => {
  return <span className={styles.badge}>{text}</span>;
};

export default memo(AddressBadge);
