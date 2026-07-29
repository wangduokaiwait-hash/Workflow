import { memo, useEffect, useRef, useCallback } from 'react';
import type { Coupon } from '../../types/coupon';
import styles from './CouponItem.module.css';

export interface CouponItemProps {
  coupon: Coupon;
  onClaim: (id: number, rect: DOMRect) => void;
}

const CouponItem = ({ coupon, onClaim }: CouponItemProps) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  // 新券高亮闪烁
  useEffect(() => {
    if (coupon.isNew && itemRef.current) {
      itemRef.current.classList.add(styles.flash);
      const t = setTimeout(() => {
        itemRef.current?.classList.remove(styles.flash);
      }, 1600);
      return () => clearTimeout(t);
    }
  }, [coupon.isNew]);

  const handleClaim = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (coupon.claimed) return;
      const rect = btnRef.current?.getBoundingClientRect();
      if (!rect) return;
      onClaim(coupon.id, rect);
    },
    [coupon.id, coupon.claimed, onClaim],
  );

  const isDiscount = coupon.type === 'discount';
  const colorClass = isDiscount ? styles.discountColor : styles.cashColor;

  return (
    <div
      ref={itemRef}
      className={`${styles.item} ${coupon.claimed ? styles.claimed : ''} ${colorClass}`}
      data-coupon-id={coupon.id}
    >
      <div className={styles.leftBar} />

      <div className={styles.valueSection}>
        {isDiscount ? (
          <div className={styles.discountValue}>
            <span className={styles.discountNum}>{coupon.value}</span>
            <span className={styles.discountUnit}>折</span>
          </div>
        ) : (
          <div className={styles.cashValue}>
            <span className={styles.cashUnit}>¥</span>
            <span className={styles.cashNum}>{coupon.value}</span>
          </div>
        )}
      </div>

      <div className={styles.divider} />

      <div className={styles.infoSection}>
        <div className={styles.titleRow}>
          <span className={styles.title}>{coupon.title}</span>
        </div>
        <div className={styles.tagRow}>
          {coupon.tags?.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
        <div className={styles.metaRow}>
          <span className={styles.condition}>{coupon.condition}</span>
          {coupon.ruleText && (
            <>
              <span className={styles.dot}>·</span>
              <span className={styles.rule}>{coupon.ruleText}</span>
            </>
          )}
        </div>
        <div className={styles.expireRow}>
          <span className={styles.expire}>有效期至 {coupon.expireAt}</span>
        </div>
      </div>

      <div className={styles.actionSection}>
        <button
          ref={btnRef}
          className={`${styles.claimBtn} ${coupon.claimed ? styles.claimedBtn : ''}`}
          onClick={handleClaim}
          disabled={coupon.claimed}
        >
          {coupon.claimed ? '已领取' : '立即领取'}
        </button>
      </div>
    </div>
  );
};

export default memo(CouponItem);
