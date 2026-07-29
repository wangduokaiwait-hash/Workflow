import { useState, useCallback } from 'react';
import type { AddressItem as AddressItemType } from './types/address';
import AddressList from './components/AddressList';
import CouponModal from './components/CouponModal';
import { mockAddresses } from './data/mockAddress';
import { mockCoupons } from './data/mockCoupon';
import styles from './App.module.css';

const App = () => {
  const [couponVisible, setCouponVisible] = useState(false);

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

  const handleClaimCoupon = useCallback((id: number) => {
    // eslint-disable-next-line no-console
    console.log('[App] 领取优惠券:', id);
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>收货地址</span>
      </div>
      <main className={styles.main}>
        <AddressList initialData={mockAddresses} onEdit={handleEdit} />

        {/* 优惠券入口 */}
        <div className={styles.couponEntry}>
          <button className={styles.couponBtn} onClick={handleOpenCoupons}>
            <span className={styles.couponBtnIcon}>🎫</span>
            <span className={styles.couponBtnText}>查看优惠券</span>
            <span className={styles.couponBtnArrow}>›</span>
          </button>
        </div>
      </main>

      {/* 优惠券浮层 */}
      <CouponModal
        visible={couponVisible}
        coupons={mockCoupons}
        onClose={handleCloseCoupons}
        onClaim={handleClaimCoupon}
      />
    </div>
  );
};

export default App;
