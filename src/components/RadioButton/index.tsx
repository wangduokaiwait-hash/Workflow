import { memo } from 'react';
import styles from './RadioButton.module.css';

export interface RadioButtonProps {
  /** 是否选中 */
  checked: boolean;
  /** 点击事件 */
  onChange: () => void;
  /** 无障碍标签 */
  ariaLabel?: string;
}

/**
 * 自定义单选按钮
 * - 20x20
 * - 默认: 1px 灰色描边, 白底
 * - 选中: 红色背景, 白色勾
 */
const RadioButton = ({ checked, onChange, ariaLabel = 'radio' }: RadioButtonProps) => {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      aria-label={ariaLabel}
      className={`${styles.radio} ${checked ? styles.checked : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
    >
      {checked && (
        <svg
          className={styles.checkIcon}
          viewBox="0 0 16 16"
          width="12"
          height="12"
          aria-hidden="true"
        >
          <path
            d="M3 8.5L6.2 11.5L13 4.5"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      )}
    </button>
  );
};

export default memo(RadioButton);
