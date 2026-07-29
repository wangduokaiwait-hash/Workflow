import { memo } from 'react';
import type { Coupon } from '../../types/coupon';
import styles from './CouponItem.module.css';

export interface CouponItemProps {
  coupon: Coupon;
  onClaim: (id: number) => void;
}

const CouponItem = ({ coupon, onClaim }: CouponItemProps) => {
  const { id, title, value, condition, expireAt, claimed, type } = coupon;

  const handleClaim = () => {
    if (!claimed) {
      onClaim(id);
    }
  };

  return (
    <div className={`${styles.item} ${claimed ? styles.claimed : ''}`}>
      <div className={styles.left}>
        <div className={styles.value}>
          {type === 'discount' ? (
            <span className={styles.discount}>
              <span className={styles.discountNum}>{value}</span>
              <span className={styles.discountUnit}>折</span>
            </span>
          ) : (
            <span className={styles.cash}>
              <span className={styles.cashUnit}>¥</span>
              <span className={styles.cashNum}>{value}</span>
            </span>
          )}
        </div>
        <div className={styles.divider} />
        <div className={styles.info}>
          <div className={styles.title}>{title}</div>
          <div className={styles.condition}>{condition}</div>
          <div className={styles.expire}>有效期至 {expireAt}</div>
        </div>
      </div>
      <div className={styles.right}>
        <button
          className={`${styles.claimBtn} ${claimed ? styles.claimedBtn : ''}`}
          onClick={handleClaim}
          disabled={claimed}
        >
          {claimed ? '已领取' : '立即领取'}
        </button>
      </div>
    </div>
  );
};

export default memo(CouponItem);
