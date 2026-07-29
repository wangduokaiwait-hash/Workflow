import { memo } from 'react';
import styles from './AddressTag.module.css';

export interface AddressTagProps {
  /** 标签文本 */
  text: string;
}

/**
 * 地址标签
 * - 背景: #FFF1F0
 * - 文字: #FF4D4F
 * - 字体: 12px
 * - Padding: 2px 6px
 * - 圆角: 4px
 */
const AddressTag = ({ text }: AddressTagProps) => {
  return <span className={styles.tag}>{text}</span>;
};

export default memo(AddressTag);
