import { useCallback, useRef, useState } from 'react';

interface Point {
  x: number;
  y: number;
}

interface AnimationState {
  startPoint: Point;
  endPoint: Point;
  progress: number;
  isAnimating: boolean;
}

export interface UseParabolaAnimationReturn {
  state: AnimationState;
  startAnimation: (startPoint: Point, endPoint: Point) => void;
  cancelAnimation: () => void;
}

/**
 * 抛物线动画 Hook
 * 用于实现元素从起点沿抛物线移动到终点
 */
export const useParabolaAnimation = (
  duration: number = 600,
): UseParabolaAnimationReturn => {
  const [state, setState] = useState<AnimationState>({
    startPoint: { x: 0, y: 0 },
    endPoint: { x: 0, y: 0 },
    progress: 0,
    isAnimating: false,
  });

  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const cancelAnimation = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setState((prev) => ({ ...prev, isAnimating: false }));
  }, []);

  const startAnimation = useCallback(
    (startPoint: Point, endPoint: Point) => {
      cancelAnimation();

      startTimeRef.current = performance.now();

      setState({
        startPoint,
        endPoint,
        progress: 0,
        isAnimating: true,
      });

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        setState((prev) => ({ ...prev, progress }));

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          setState((prev) => ({ ...prev, isAnimating: false, progress: 0 }));
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    },
    [duration, cancelAnimation],
  );

  return { state, startAnimation, cancelAnimation };
};

/**
 * 计算抛物线上的点
 */
export const calculateParabolaPoint = (
  startPoint: Point,
  endPoint: Point,
  progress: number,
  height: number = 50,
): Point => {
  const x = startPoint.x + (endPoint.x - startPoint.x) * progress;
  const baseY = startPoint.y + (endPoint.y - startPoint.y) * progress;
  const parabolaY = -4 * height * progress * (1 - progress);
  return { x, y: baseY + parabolaY };
};
