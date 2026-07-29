import { memo, useEffect, useRef } from 'react';
import styles from './RedPacketParticle.module.css';

export interface RedPacketParticleProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  duration: number;
  delay?: number;
  onComplete?: () => void;
  /** 容器选择器, 用于获取相对坐标 */
  containerSelector?: string;
}

/**
 * 红包粒子 - 抛物线飞向目标
 * 使用 Web Animations API 与 rAF 结合, 保证多端兼容性
 */
const RedPacketParticle = ({
  fromX,
  fromY,
  toX,
  toY,
  duration,
  delay = 0,
  onComplete,
}: RedPacketParticleProps) => {
  const elRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    // 初始位置 (屏幕坐标)
    el.style.left = `${fromX}px`;
    el.style.top = `${fromY}px`;
    el.style.opacity = '1';
    el.style.transform = 'translate(-50%, -50%) scale(1)';

    const start = performance.now();
    startTimeRef.current = start;
    let lastTriggered = false;

    const animate = (now: number) => {
      const elapsed = now - start - delay;
      if (elapsed < 0) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      const t = Math.min(elapsed / duration, 1);

      // 二次贝塞尔曲线, 控制点在起点与终点中间偏上
      const midX = (fromX + toX) / 2;
      const midY = Math.min(fromY, toY) - 80; // 往上飘起

      // 抛物线公式: B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
      const x = (1 - t) ** 2 * fromX + 2 * (1 - t) * t * midX + t * t * toX;
      const y = (1 - t) ** 2 * fromY + 2 * (1 - t) * t * midY + t * t * toY;

      // 旋转角度, 指向目标方向
      const angle = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI);

      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.transform = `translate(-50%, -50%) scale(${t < 0.15 ? 1 + t * 3 : 1.4 - t * 0.4}) rotate(${angle * (1 - t) * 0.2}deg)`;
      el.style.opacity = `${t > 0.85 ? 1 - (t - 0.85) / 0.15 : 1}`;

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        if (!lastTriggered) {
          lastTriggered = true;
          onComplete?.();
        }
      }
    };

    // 初始延迟
    if (delay > 0) {
      const delayTimer = setTimeout(() => {
        rafRef.current = requestAnimationFrame(animate);
      }, delay);
      return () => {
        clearTimeout(delayTimer);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    } else {
      rafRef.current = requestAnimationFrame(animate);
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }
  }, [fromX, fromY, toX, toY, duration, delay, onComplete]);

  return (
    <div
      ref={elRef}
      className={styles.particle}
      style={{ left: fromX, top: fromY }}
    >
      <div className={styles.packet}>
        <span className={styles.yuan}>¥</span>
      </div>
      <div className={styles.glow} />
    </div>
  );
};

export default memo(RedPacketParticle);
