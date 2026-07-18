import confetti from 'canvas-confetti';

// LifeQuest brand burst — fired when a mission is completed or a reward
// is claimed. Dawn-expedition colours: coral, honey, aqua, sky, paper.
// Respects reduced-motion preferences.
const COLORS = ['#f2795c', '#f0b429', '#2fbfa2', '#63b3d9', '#faf5ea'];

export function celebrate(): void {
  confetti({
    particleCount: 90,
    spread: 72,
    startVelocity: 42,
    origin: { y: 0.62 },
    colors: COLORS,
    disableForReducedMotion: true,
  });
  window.setTimeout(() => {
    confetti({
      particleCount: 55,
      spread: 110,
      decay: 0.92,
      scalar: 0.9,
      origin: { y: 0.5 },
      colors: COLORS,
      disableForReducedMotion: true,
    });
  }, 160);
}
