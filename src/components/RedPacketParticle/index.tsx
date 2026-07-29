import { useState, useCallback } from 'react';
import styles from './RedPacketParticle.module.css';

interface Particle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
}

let particleId = 0;

const RedPacketParticle = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const createParticles = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;

    const newParticles: Particle[] = [];
    for (let i = 0; i < 6; i++) {
      particleId++;
      const angle = (Math.PI * 2 * i) / 6;
      newParticles.push({
        id: particleId,
        x: startX,
        y: startY,
        dx: Math.cos(angle) * (50 + Math.random() * 30),
        dy: Math.sin(angle) * (50 + Math.random() * 30),
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 800);
  }, []);

  return (
    <div className={styles.container} onClick={createParticles}>
      {particles.map((p) => (
        <span
          key={p.id}
          className={styles.particle}
          style={{
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
            left: `${p.x}px`,
            top: `${p.y}px`,
          } as React.CSSProperties}
        >
          💰
        </span>
      ))}
    </div>
  );
};

export default RedPacketParticle;
