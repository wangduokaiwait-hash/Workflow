import { memo } from 'react';
import type { Coupon } from '../../types/coupon';
import CouponItem from '../CouponItem';
import RedPacketParticle from '../RedPacketParticle';
import styles from './CouponModal.module.css';

export interface CouponModalProps {
  visible: boolean;
  coupons: Coupon[];
  onClose: () => void;
  onClaim: (id: number) => void;
}

const CouponModal = ({ visible, coupons, onClose, onClaim }: CouponModalProps) => {
  if (!visible) return null;

  return (
    <div className={styles.mask} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.title}>🎁 优惠券中心</span>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>
        <div className={styles.content}>
          {coupons.map((coupon) => (
            <div key={coupon.id} className={styles.couponWrapper}>
              <CouponItem coupon={coupon} onClaim={onClaim} />
              {coupon.type === 'cash' && <RedPacketParticle />}
            </div>
          ))}
          {coupons.length === 0 && (
            <div className={styles.empty}>暂无可用优惠券</div>
          )}
        </div>
        <div className={styles.footer}>
          <span className={styles.tip}>优惠券将在结算时自动抵扣</span>
        </div>
      </div>
    </div>
  );
};

export default memo(CouponModal);
