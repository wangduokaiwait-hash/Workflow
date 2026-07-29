import { useState, useCallback } from 'react';
import type { AddressItem as AddressItemType } from './types/address';
import type { Coupon } from './types/coupon';
import AddressList from './components/AddressList';
import CouponModal from './components/CouponModal';
import { mockAddresses } from './data/mockAddress';
import { mockCoupons as initialCoupons } from './data/mockCoupon';
import styles from './App.module.css';

const App = () => {
  const [couponVisible, setCouponVisible] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  const handleEdit = (item: AddressItemType) => {
    // eslint-disable-next-line no-alert
    alert(`编辑地址: ${item.name} - ${item.address}`);
  };

  const handleOpenCoupons = useCallback(() => {
    setCouponVisible(true);
  }, []);

  const handleCloseCoupons = useCallback(() => {
    setCouponVisible(false);
  }, []);

  const handleClaimCoupon = useCallback(
    (claimedId: number, newCouponIds: number[]) => {
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === claimedId ? { ...c, claimed: true } : c,
        ),
      );

      setTimeout(() => {
        setCoupons((prev) =>
          prev.map((c) =>
            newCouponIds.includes(c.id) ? { ...c, isNew: true } : c,
          ),
        );

        setTimeout(() => {
          setCoupons((prev) =>
            prev.map((c) =>
              newCouponIds.includes(c.id) ? { ...c, isNew: false } : c,
            ),
          );
        }, 2000);
      }, 800);
    },
    [],
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>收货地址</span>
      </div>
      <main className={styles.main}>
        <AddressList initialData={mockAddresses} onEdit={handleEdit} />

        <div className={styles.couponEntry}>
          <button className={styles.couponBtn} onClick={handleOpenCoupons}>
            <span className={styles.couponBtnIcon}>🎫</span>
            <span className={styles.couponBtnText}>查看优惠券</span>
            <span className={styles.couponBtnArrow}>›</span>
          </button>
        </div>
      </main>

      <CouponModal
        visible={couponVisible}
        coupons={coupons}
        onClose={handleCloseCoupons}
        onClaim={handleClaimCoupon}
      />
    </div>
  );
};

export default App;
