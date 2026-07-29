import { memo, useCallback, useEffect, useRef, useState } from 'react';
import type { CouponItem as CouponItemType } from '../../types/coupon';
import CouponItem from '../CouponItem';
import RedPacketParticle from '../RedPacketParticle';
import styles from './CouponModal.module.css';

interface CouponModalProps {
  /** 是否显示 */
  visible: boolean;
  /** 优惠券列表数据 */
  coupons: CouponItemType[];
  /** 关闭回调 */
  onClose: () => void;
  /** 领券回调 */
  onClaim?: (id: number) => void;
}

/**
 * 优惠券浮层（底部弹窗）
 * - 支持上下滑动关闭
 * - 点击领券后触发红包抛物线动画
 * - 新券高亮闪烁
 */
const CouponModal = ({ visible, coupons, onClose, onClaim }: CouponModalProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [couponList, setCouponList] = useState<CouponItemType[]>(coupons);
  const [newCouponIds, setNewCouponIds] = useState<Set<number>>(new Set());
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      fromX: number;
      fromY: number;
      toX: number;
      toY: number;
      duration: number;
      delay: number;
    }>
  >([]);

  const sheetRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const currentTranslateY = useRef(0);

  // 同步外部数据变化
  useEffect(() => {
    setCouponList(coupons);
  }, [coupons]);

  // 打开/关闭动画
  useEffect(() => {
    if (visible) {
      setIsClosing(false);
      setIsOpen(false);
      // 下一帧触发打开动画
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsOpen(true);
        });
      });
    } else {
      setIsOpen(false);
    }
  }, [visible]);

  // 处理关闭
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  }, [onClose]);

  // 触摸开始
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    currentTranslateY.current = 0;
  }, []);

  // 触摸移动（向下滑动关闭）
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const diff = currentY - touchStartY.current;

      // 只在向下滑动时处理
      if (diff > 0) {
        currentTranslateY.current = diff;
        if (sheetRef.current) {
          sheetRef.current.style.transform = `translateY(${diff}px)`;
          sheetRef.current.style.transition = 'none';
        }
      }
    },
    [],
  );

  // 触摸结束
  const handleTouchEnd = useCallback(() => {
    const diff = currentTranslateY.current;
    const duration = Date.now() - touchStartTime.current;
    const velocity = diff / duration;

    // 滑动超过 100px 或速度较快时关闭
    if (diff > 100 || (diff > 50 && velocity > 0.5)) {
      if (sheetRef.current) {
        sheetRef.current.style.transform = `translateY(100%)`;
        sheetRef.current.style.transition = 'transform 0.3s ease-out';
      }
      handleClose();
    } else {
      // 回弹
      if (sheetRef.current) {
        sheetRef.current.style.transform = 'translateY(0)';
        sheetRef.current.style.transition = 'transform 0.3s ease-out';
      }
    }
  }, [handleClose]);

  // 生成抛物线关键帧
  const generateParabolaKeyframes = (
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    height: number,
  ) => {
    const frames: Array<{ x: number; y: number }> = [];
    const steps = 30;
    const midX = (fromX + toX) / 2;
    const midY = Math.min(fromY, toY) - height;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = (1 - t) * (1 - t) * fromX + 2 * (1 - t) * t * midX + t * t * toX;
      const y = (1 - t) * (1 - t) * fromY + 2 * (1 - t) * t * midY + t * t * toY;
      frames.push({ x, y });
    }
    return frames;
  };

  // 处理领券（带抛物线动画）
  const handleClaim = useCallback(
    async (couponId: number) => {
      const buttonEl = document.querySelector(
        `[data-coupon-id="${couponId}"] [data-claim-btn="true"]`,
      ) as HTMLElement | null;

      if (!buttonEl || !listRef.current) return;

      // 先调用外部回调
      onClaim?.(couponId);

      // 标记原券为已领取
      setCouponList((prev) =>
        prev.map((c) => (c.id === couponId ? { ...c, claimed: true } : c)),
      );

      // 随机生成 1-4 张新券
      const newCount = Math.floor(Math.random() * 4) + 1;
      const newCoupons: CouponItemType[] = [];
      const newIds = new Set<number>();
      const maxId = Math.max(...couponList.map((c) => c.id), 0);

      for (let i = 0; i < newCount; i++) {
        const id = maxId + i + 1;
        const prices = ['5元', '10元', '20元', '免配送费', '满100减30'];
        const titles = [
          '新客专享优惠券',
          '限时抢购券',
          '满减通用券',
          '会员体验券',
          '生日特权券',
        ];
        newCoupons.push({
          id,
          type: 'normal',
          title: titles[Math.floor(Math.random() * titles.length)],
          price: prices[Math.floor(Math.random() * prices.length)],
          validPeriod: '2025.10.29-11.29',
          claimed: false,
          isNew: true,
          tags: ['新领'],
        });
        newIds.add(id);
      }

      // 计算按钮位置（动画起点）
      const buttonRect = buttonEl.getBoundingClientRect();
      const fromX = buttonRect.left + buttonRect.width / 2;
      const fromY = buttonRect.top + buttonRect.height / 2;

      // 计算新券要插入的位置（列表底部）
      const listRect = listRef.current.getBoundingClientRect();
      const toX = listRect.left + listRect.width / 2;
      const toY = listRect.bottom - 60;

      // 生成粒子
      const newParticles = [];
      for (let i = 0; i < newCount; i++) {
        const offsetX = (Math.random() - 0.5) * 120;
        const offsetY = (Math.random() - 0.5) * 60;
        newParticles.push({
          id: Date.now() + i,
          fromX,
          fromY,
          toX: toX + offsetX,
          toY: toY + offsetY,
          duration: 600 + Math.random() * 300,
          delay: i * 100,
        });
      }

      setParticles(newParticles);

      // 等待动画完成后插入新券
      const maxDelay = Math.max(...newParticles.map((p) => p.duration + p.delay));

      setTimeout(() => {
        setParticles([]);
        setCouponList((prev) => [...prev, ...newCoupons]);
        setNewCouponIds(newIds);

        // 1.5秒后清除新券标记
        setTimeout(() => {
          setNewCouponIds(new Set());
        }, 1500);
      }, maxDelay + 100);
    },
    [couponList, onClaim],
  );

  if (!visible && !isClosing) return null;

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
      onClick={handleClose}
    >
      <div
        ref={sheetRef}
        className={`${styles.sheet} ${isOpen ? styles.sheetVisible : ''}`}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 头部拖动条 */}
        <div className={styles.handleBar}>
          <div className={styles.handle} />
        </div>

        {/* 标题 */}
        <div className={styles.header}>
          <h3 className={styles.title}>优惠券</h3>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="关闭">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="#999"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* 优惠券列表 */}
        <div ref={listRef} className={styles.list}>
          {couponList.map((coupon) => (
            <div key={coupon.id} data-coupon-id={coupon.id}>
              <CouponItem
                data={coupon}
                isNew={newCouponIds.has(coupon.id)}
                onClaim={handleClaim}
              />
            </div>
          ))}

          {couponList.length === 0 && (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>暂无优惠券</p>
            </div>
          )}
        </div>

        {/* 底部安全区域 */}
        <div className={styles.safeArea} />
      </div>

      {/* 红包飞行动画粒子 */}
      {particles.map((particle) => (
        <RedPacketParticle
          key={particle.id}
          particle={particle}
        />
      ))}
    </div>
  );
};

export default memo(CouponModal);
