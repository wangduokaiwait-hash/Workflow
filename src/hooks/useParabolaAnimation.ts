import { useCallback, useRef, useState } from 'react';
import type { FlyingParticle } from '../types/coupon';

let particleId = 0;

/**
 * 生成抛物线动画的关键帧
 * 使用二次贝塞尔曲线模拟抛物线运动
 */
function generateParabolaKeyframes(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  height: number = 120,
): { x: number; y: number }[] {
  const frames: { x: number; y: number }[] = [];
  const steps = 30;

  // 控制点：取中点上方，形成抛物线
  const midX = (fromX + toX) / 2;
  const midY = Math.min(fromY, toY) - height;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // 二次贝塞尔曲线公式
    const x = (1 - t) * (1 - t) * fromX + 2 * (1 - t) * t * midX + t * t * toX;
    const y = (1 - t) * (1 - t) * fromY + 2 * (1 - t) * t * midY + t * t * toY;
    frames.push({ x, y });
  }

  return frames;
}

/**
 * 抛物线飞行动画 Hook
 * - 管理飞行中的红包粒子
 * - 提供发射粒子方法
 * - 提供粒子动画结束回调
 */
export function useParabolaAnimation() {
  const [particles, setParticles] = useState<FlyingParticle[]>([]);
  const animatingRef = useRef(false);

  /**
   * 发射红包粒子
   * @param fromRect 起始元素的位置信息
   * @param toRect 目标元素的位置信息
   * @param count 粒子数量 (1-4)
   */
  const launchParticles = useCallback(
    (
      fromRect: DOMRect,
      toRect: DOMRect,
      count: number = 3,
    ): Promise<void> => {
      return new Promise((resolve) => {
        animatingRef.current = true;

        // 计算起点和终点（元素中心点）
        const fromX = fromRect.left + fromRect.width / 2;
        const fromY = fromRect.top + fromRect.height / 2;
        const toX = toRect.left + toRect.width / 2;
        const toY = toRect.top + toRect.height / 2;

        // 生成粒子配置（每个粒子略有偏移，形成分散效果）
        const newParticles: FlyingParticle[] = [];
        for (let i = 0; i < count; i++) {
          particleId += 1;
          // 目标位置添加随机偏移，但保持落在券图区域内
          const offsetX = (Math.random() - 0.5) * toRect.width * 0.5;
          const offsetY = (Math.random() - 0.5) * toRect.height * 0.3;
          newParticles.push({
            id: particleId + i,
            fromX,
            fromY,
            toX: toX + offsetX,
            toY: toY + offsetY,
            duration: 600 + Math.random() * 400, // 600-1000ms
            delay: i * 80, // 每个粒子间隔 80ms 发射
          });
        }

        setParticles(newParticles);

        // 计算最长动画时间，然后清除粒子
        const maxDuration = Math.max(...newParticles.map((p) => p.duration + p.delay));
        setTimeout(() => {
          setParticles([]);
          animatingRef.current = false;
          resolve();
        }, maxDuration + 100);
      });
    },
    [],
  );

  /**
   * 获取粒子动画的CSS样式
   */
  const getParticleStyle = useCallback(
    (particle: FlyingParticle): React.CSSProperties => {
      const frames = generateParabolaKeyframes(
        particle.fromX,
        particle.fromY,
        particle.toX,
        particle.toY,
        100 + Math.random() * 80, // 抛物线高度随机 100-180
      );

      // 将关键帧转换为 CSS transform 字符串
      const keyframes = frames
        .map((f, i) => {
          const percent = (i / (frames.length - 1)) * 100;
          return `${percent.toFixed(1)}% { transform: translate(${f.x - particle.fromX}px, ${f.y - particle.fromY}px) scale(${1 - (i / frames.length) * 0.3}); }`;
        })
        .join(' ');

      // 使用 CSS 变量传递关键帧（在组件中通过 style 注入）
      return {
        left: particle.fromX,
        top: particle.fromY,
        '--parabola-keyframes': keyframes,
        animationDuration: `${particle.duration}ms`,
        animationDelay: `${particle.delay}ms`,
      } as React.CSSProperties;
    },
    [],
  );

  return {
    particles,
    launchParticles,
    getParticleStyle,
    isAnimating: animatingRef.current,
  };
}

/**
 * 使用 Web Animations API 实现抛物线动画（更精确控制）
 */
export function useWAAPIParabola() {
  const [particles, setParticles] = useState<FlyingParticle[]>([]);
  const particleRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const registerParticleRef = useCallback((id: number, el: HTMLDivElement | null) => {
    if (el) {
      particleRefs.current.set(id, el);
    } else {
      particleRefs.current.delete(id);
    }
  }, []);

  const animateParticles = useCallback(
    async (
      fromRect: DOMRect,
      toRect: DOMRect,
      count: number = 3,
    ): Promise<void> => {
      return new Promise((resolve) => {
        const fromX = fromRect.left + fromRect.width / 2;
        const fromY = fromRect.top + fromRect.height / 2;
        const toX = toRect.left + toRect.width / 2;
        const toY = toRect.top + toRect.height / 2;

        const newParticles: FlyingParticle[] = [];
        const animations: Animation[] = [];

        for (let i = 0; i < count; i++) {
          particleId += 1;
          const offsetX = (Math.random() - 0.5) * toRect.width * 0.4;
          const offsetY = (Math.random() - 0.5) * toRect.height * 0.2;
          const particle: FlyingParticle = {
            id: particleId + i,
            fromX,
            fromY,
            toX: toX + offsetX,
            toY: toY + offsetY,
            duration: 700 + Math.random() * 300,
            delay: i * 100,
          };
          newParticles.push(particle);
        }

        setParticles(newParticles);

        // 使用 requestAnimationFrame 等待 DOM 更新后再执行动画
        requestAnimationFrame(() => {
          newParticles.forEach((p) => {
            const el = particleRefs.current.get(p.id);
            if (!el) return;

            const frames = generateParabolaKeyframes(
              p.fromX,
              p.fromY,
              p.toX,
              p.toY,
              120 + Math.random() * 100,
            );

            const keyframes = frames.map((f) => ({
              transform: `translate(${f.x - p.fromX}px, ${f.y - p.fromY}px) scale(${0.6 + Math.random() * 0.4})`,
              opacity: f.x === p.fromX && f.y === p.fromY ? 1 : f.x === p.toX && f.y === p.toY ? 0.3 : 1,
            }));

            const anim = el.animate(keyframes, {
              duration: p.duration,
              delay: p.delay,
              easing: 'ease-out',
              fill: 'forwards',
            });

            animations.push(anim);
          });

          // 等待所有动画完成
          Promise.all(animations.map((a) => a.finished)).then(() => {
            setParticles([]);
            resolve();
          });
        });
      });
    },
    [],
  );

  return {
    particles,
    animateParticles,
    registerParticleRef,
  };
}
