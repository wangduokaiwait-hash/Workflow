import { memo, type MouseEvent } from 'react';
import styles from './EditButton.module.css';

export interface EditButtonProps {
  /** 点击事件(已 stopPropagation 防止冒泡到 Item) */
  onEdit: (e: MouseEvent<HTMLButtonElement>) => void;
  /** 无障碍标签 */
  ariaLabel?: string;
}

/**
 * 编辑按钮 - 铅笔图标
 * - 颜色: #FF4D4F
 * - 大小: 20px
 */
const EditButton = ({ onEdit, ariaLabel = '编辑地址' }: EditButtonProps) => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onEdit(e);
  };

  return (
    <button
      type="button"
      className={styles.editBtn}
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      <svg
        className={styles.icon}
        viewBox="0 0 20 20"
        width="20"
        height="20"
        aria-hidden="true"
      >
        <path
          d="M14.06 3.94a1.5 1.5 0 0 1 2.12 0l.88.88a1.5 1.5 0 0 1 0 2.12L8.5 15.5l-3.5.5.5-3.5L14.06 3.94Z"
          stroke="#FF4D4F"
          strokeWidth="1.4"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M13 5L16 8"
          stroke="#FF4D4F"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
};

export default memo(EditButton);
