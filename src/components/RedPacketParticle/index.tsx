import { memo, useEffect, useRef } from 'react';
import type { FlyingParticle } from '../../types/coupon';
import styles from './RedPacketParticle.module.css';

interface RedPacketParticleProps {
  particle: FlyingParticle;
  onAnimationEnd?: () => void;
}

/**
 * 单个红包飞行动画粒子
 * 使用 Web Animations API 实现精确抛物线
 */
const RedPacketParticle = ({ particle, onAnimationEnd }: RedPacketParticleProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 二次贝塞尔曲线生成抛物线关键帧
    const steps = 30;
    const midX = (particle.fromX + particle.toX) / 2;
    const midY = Math.min(particle.fromY, particle.toY) - 120 - Math.random() * 80;
    const keyframes: Keyframe[] = [];

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x =
        (1 - t) * (1 - t) * particle.fromX +
        2 * (1 - t) * t * midX +
        t * t * particle.toX;
      const y =
        (1 - t) * (1 - t) * particle.fromY +
        2 * (1 - t) * t * midY +
        t * t * particle.toY;
      keyframes.push({
        transform: `translate(${x - particle.fromX}px, ${y - particle.fromY}px) scale(${1 - t * 0.3})`,
        opacity: t > 0.9 ? 0.2 : 1,
      });
    }

    const anim = el.animate(keyframes, {
      duration: particle.duration,
      delay: particle.delay,
      easing: 'ease-out',
      fill: 'forwards',
    });

    anim.onfinish = () => {
      onAnimationEnd?.();
    };

    return () => {
      anim.cancel();
    };
  }, [particle, onAnimationEnd]);

  return (
    <div
      ref={ref}
      className={styles.particle}
      style={{
        left: particle.fromX,
        top: particle.fromY,
      }}
    >
      <div className={styles.packet}>
        <div className={styles.packetBody}>
          <span className={styles.packetIcon}>¥</span>
        </div>
      </div>
    </div>
  );
};

export default memo(RedPacketParticle);
