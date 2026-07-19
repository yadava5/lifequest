import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useTheme } from '@/features/theme/ThemeProvider';

/* -------------------------------------------------------------------------- *
 *  DawnBackdrop — the app's living backdrop: a soft rising-sun wash on the
 *  horizon, warm dust + a few honey coins drifting up like embers, and a faint
 *  trail of glowing waypoints. It answers the cursor with a gentle parallax.
 *
 *  Warm dawn palette only (coral / gold / teal / sky over lagoon-or-paper).
 *  Cheap by construction: ~30 motes, one rAF, DPR-capped, paused when the tab
 *  is hidden. Reduced motion paints a single static frame and stops.
 * -------------------------------------------------------------------------- */

type Mote = {
  x: number;
  y: number;
  r: number;
  vy: number;
  drift: number;
  phase: number;
  hue: 'gold' | 'coral' | 'sky' | 'teal';
  coin: boolean;
};

const readVar = (name: string, fallback: string) => {
  if (typeof window === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
};

export const DawnBackdrop = () => {
  const reduced = useReducedMotion();
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0.5, y: 0.4, tx: 0.5, ty: 0.4 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const palette = {
      gold: readVar('--gold', '41 92% 60%'),
      coral: readVar('--coral', '14 86% 64%'),
      sky: readVar('--sky', '199 68% 64%'),
      teal: readVar('--teal', '168 66% 52%'),
    } as const;
    const isDay = theme === 'light';
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const COUNT = w < 640 ? 18 : 30;
    const motes: Mote[] = Array.from({ length: COUNT }, () => {
      const coin = Math.random() < 0.16;
      const hues: Mote['hue'][] = ['gold', 'gold', 'coral', 'sky', 'teal'];
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: coin ? 3.4 + Math.random() * 2.2 : 0.8 + Math.random() * 1.8,
        vy: (coin ? 6 : 9) + Math.random() * 12,
        drift: (Math.random() - 0.5) * 10,
        phase: Math.random() * Math.PI * 2,
        hue: coin ? 'gold' : hues[Math.floor(Math.random() * hues.length)],
        coin,
      };
    });

    // A faint trail of waypoints, low on the scene — a distant switchback.
    const waypoints = [
      { x: 0.14, y: 0.82 },
      { x: 0.34, y: 0.72 },
      { x: 0.52, y: 0.78 },
      { x: 0.7, y: 0.66 },
      { x: 0.86, y: 0.56 },
    ];

    const drawSun = () => {
      // rising-sun wash anchored to the horizon, breathing slowly.
      const t = performance.now() / 1000;
      const breathe = reduced ? 0 : Math.sin(t * 0.18) * 0.04;
      const cx = w * (0.5 + (pointer.current.x - 0.5) * 0.06);
      const cy = h * (0.96 - breathe);
      const rad = Math.max(w, h) * (0.62 + breathe);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
      const a = isDay ? 0.16 : 0.22;
      g.addColorStop(0, `hsl(${palette.gold} / ${a})`);
      g.addColorStop(0.32, `hsl(${palette.coral} / ${a * 0.72})`);
      g.addColorStop(0.72, `hsl(${palette.coral} / 0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // a second cool pool up top-left keeps it from feeling one-note.
      const g2 = ctx.createRadialGradient(w * 0.16, h * 0.1, 0, w * 0.16, h * 0.1, w * 0.5);
      g2.addColorStop(0, `hsl(${palette.teal} / ${isDay ? 0.06 : 0.1})`);
      g2.addColorStop(1, `hsl(${palette.teal} / 0)`);
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);
    };

    const drawWaypoints = (t: number) => {
      const parX = (pointer.current.x - 0.5) * 22;
      const parY = (pointer.current.y - 0.5) * 12;
      ctx.save();
      // faint connecting trail
      ctx.beginPath();
      waypoints.forEach((p, i) => {
        const x = p.x * w + parX;
        const y = p.y * h + parY;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = `hsl(${palette.coral} / ${isDay ? 0.05 : 0.08})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 7]);
      ctx.stroke();
      ctx.setLineDash([]);
      // glowing nodes, twinkling out of phase
      waypoints.forEach((p, i) => {
        const x = p.x * w + parX;
        const y = p.y * h + parY;
        const tw = reduced ? 0.5 : 0.5 + Math.sin(t * 0.8 + i) * 0.5;
        const r = 2.2 + tw * 1.6;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
        glow.addColorStop(0, `hsl(${palette.gold} / ${(isDay ? 0.18 : 0.3) * (0.5 + tw / 2)})`);
        glow.addColorStop(1, `hsl(${palette.gold} / 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, r * 4, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    };

    const drawMote = (m: Mote, t: number) => {
      const parX = (pointer.current.x - 0.5) * (m.coin ? 34 : 18);
      const parY = (pointer.current.y - 0.5) * (m.coin ? 20 : 10);
      const sway = reduced ? 0 : Math.sin(t * 0.6 + m.phase) * m.drift;
      const x = m.x + sway + parX;
      const y = m.y + parY;
      const baseA = isDay ? 0.5 : 0.62;
      if (m.coin) {
        // a soft honey coin: filled disc + ring, low alpha.
        ctx.beginPath();
        ctx.arc(x, y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${palette.gold} / ${baseA * 0.4})`;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = `hsl(${palette.gold} / ${baseA * 0.7})`;
        ctx.stroke();
      } else {
        const twinkle = reduced ? 1 : 0.55 + Math.sin(t * 1.3 + m.phase) * 0.45;
        ctx.beginPath();
        ctx.arc(x, y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${palette[m.hue]} / ${baseA * twinkle})`;
        ctx.fill();
      }
    };

    let raf = 0;
    const frame = () => {
      const t = performance.now() / 1000;
      // ease pointer toward target for buttery parallax
      pointer.current.x += (pointer.current.tx - pointer.current.x) * 0.05;
      pointer.current.y += (pointer.current.ty - pointer.current.y) * 0.05;

      ctx.clearRect(0, 0, w, h);
      drawSun();
      drawWaypoints(t);
      for (const m of motes) {
        if (!reduced) {
          m.y -= m.vy * 0.016;
          if (m.y < -8) {
            m.y = h + 8;
            m.x = Math.random() * w;
          }
        }
        drawMote(m, t);
      }
      raf = requestAnimationFrame(frame);
    };

    if (reduced) {
      // one resolved frame, then stop.
      ctx.clearRect(0, 0, w, h);
      drawSun();
      drawWaypoints(0);
      for (const m of motes) drawMote(m, 0);
    } else {
      raf = requestAnimationFrame(frame);
    }

    const onPointer = (e: PointerEvent) => {
      pointer.current.tx = e.clientX / window.innerWidth;
      pointer.current.ty = e.clientY / window.innerHeight;
    };
    const onVisibility = () => {
      if (reduced) return;
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(frame);
      }
    };
    window.addEventListener('resize', resize);
    if (!reduced) window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduced, theme]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
};
