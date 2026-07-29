import { memo, useCallback, useEffect, useRef, useState } from 'react';
import type { Coupon } from '../../types/coupon';
import CouponItem from '../CouponItem';
import RedPacketParticle from '../RedPacketParticle';
import styles from './CouponModal.module.css';

export interface ParticleData {
  id: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  duration: number;
  delay: number;
}

export interface CouponModalProps {
  visible: boolean;
  coupons: Coupon[];
  onClose: () => void;
  /** (claimedCouponId, newCouponIds) => void */
  onClaim: (id: number, newCouponIds: number[]) => void;
}

const DRAG_THRESHOLD = 60;

const CouponModal = ({ visible, coupons, onClose, onClaim }: CouponModalProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const [particles, setParticles] = useState<ParticleData[]>([]);
  const particleIdRef = useRef(0);
  const animatingRef = useRef(false);

  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      const delta = e.touches[0].clientY - dragStartY.current;
      if (delta > 0) {
        setDragOffset(delta);
      }
    },
    [isDragging],
  );

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    if (dragOffset > DRAG_THRESHOLD) {
      onClose();
    } else {
      setDragOffset(0);
    }
    setIsDragging(false);
  }, [isDragging, dragOffset, onClose]);

  const handleClaim = useCallback(
    (id: number, rect: DOMRect) => {
      if (animatingRef.current) return;

      const availableCoupons = coupons.filter((c) => !c.claimed && c.id !== id);
      if (availableCoupons.length === 0) return;

      const count = Math.min(
        1 + Math.floor(Math.random() * 4),
        availableCoupons.length,
      );
      const shuffled = [...availableCoupons].sort(() => Math.random() - 0.5);
      const targetCoupons = shuffled.slice(0, count);

      animatingRef.current = true;

      const newParticles: ParticleData[] = targetCoupons.map((targetCoupon, i) => {
        const el = document.querySelector(
          `[data-coupon-id="${targetCoupon.id}"]`,
        );
        if (!el) return null;

        const targetRect = el.getBoundingClientRect();
        const toX = targetRect.left + targetRect.width / 2;
        const toY = targetRect.top + targetRect.height / 2;

        particleIdRef.current += 1;
        return {
          id: particleIdRef.current,
          fromX: rect.left + rect.width / 2,
          fromY: rect.top + rect.height / 2,
          toX,
          toY,
          duration: 600 + Math.random() * 200,
          delay: i * 80,
        };
      }).filter(Boolean) as ParticleData[];

      setParticles(newParticles);

      const newCouponIds = targetCoupons.map((c) => c.id);
      onClaim(id, newCouponIds);

      const maxDuration = Math.max(
        ...newParticles.map((p) => p.duration + p.delay),
        0,
      );

      setTimeout(() => {
        setTimeout(() => {
          animatingRef.current = false;
          setParticles([]);
        }, 200);
      }, maxDuration + 100);
    },
    [coupons, onClaim],
  );

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className={styles.mask} onClick={onClose}>
      <div
        ref={panelRef}
        className={`${styles.panel} ${isDragging ? styles.dragging : ''}`}
        style={{ transform: `translateY(${dragOffset}px)` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={styles.handle}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart as unknown as React.MouseEventHandler}
          onMouseMove={handleTouchMove as unknown as React.MouseEventHandler}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
        >
          <div className={styles.handleBar} />
        </div>

        <div className={styles.header}>
          <h3 className={styles.title}>领券中心</h3>
          <span className={styles.count}>共 {coupons.length} 张可用</span>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 5L15 15M15 5L5 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          {coupons.map((coupon) => (
            <CouponItem
              key={coupon.id}
              coupon={coupon}
              onClaim={handleClaim}
            />
          ))}
        </div>

        <div className={styles.footer}>
          <span className={styles.hint}>上下滑动可关闭</span>
        </div>
      </div>

      {particles.map((p) => (
        <RedPacketParticle
          key={p.id}
          fromX={p.fromX}
          fromY={p.fromY}
          toX={p.toX}
          toY={p.toY}
          duration={p.duration}
          delay={p.delay}
        />
      ))}
    </div>
  );
};

export default memo(CouponModal);
