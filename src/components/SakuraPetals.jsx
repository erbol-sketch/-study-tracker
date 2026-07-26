import { useEffect, useRef } from "react";

/**
 * Fullscreen ambient background: sakura petals drifting from the
 * top-right corner down to the bottom-left corner.
 *
 * Usage: render once near the root of the app, e.g. in App.jsx:
 *
 *   <SakuraPetals />
 *   <AppContent />
 *
 * It's fixed + pointer-events:none, so it never blocks clicks and
 * sits behind your normal UI as long as your page background is
 * transparent or you keep this mounted first in the DOM.
 */
function SakuraPetals({ count = 26, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationId;
    let petals = [];

    // overall drift direction: top-right -> bottom-left
    const DRIFT_X = -0.55; // px/frame, negative = leftward
    const DRIFT_Y = 0.85; // px/frame, positive = downward

    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    function makePetal(spawnAnywhere) {
      const size = rand(7, 15);
      return {
        x: spawnAnywhere ? rand(0, width) : width + rand(0, width * 0.4),
        y: spawnAnywhere ? rand(-height * 0.2, height) : rand(-height * 0.3, -10),
        size,
        speedX: DRIFT_X + rand(-0.35, 0.15),
        speedY: DRIFT_Y + rand(-0.25, 0.35),
        sway: rand(0.6, 1.6),
        swaySpeed: rand(0.006, 0.018),
        swayOffset: rand(0, Math.PI * 2),
        rotation: rand(0, Math.PI * 2),
        rotationSpeed: rand(-0.02, 0.02),
        opacity: rand(0.45, 0.9),
        hue: rand(-6, 10), // slight pink hue variance
      };
    }

    petals = Array.from({ length: count }, () => makePetal(true));

    function drawPetal(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;

      const g = ctx.createLinearGradient(-p.size, -p.size, p.size, p.size);
      g.addColorStop(0, `hsl(${340 + p.hue}, 85%, 82%)`);
      g.addColorStop(1, `hsl(${330 + p.hue}, 90%, 68%)`);
      ctx.fillStyle = g;

      // simple petal shape: two curves meeting at a point (like a heart-ish teardrop)
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size * 0.9, -p.size * 0.6, p.size * 0.8, p.size * 0.5, 0, p.size);
      ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.9, -p.size * 0.6, 0, -p.size);
      ctx.fill();

      // faint center vein
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 0.7);
      ctx.lineTo(0, p.size * 0.7);
      ctx.stroke();

      ctx.restore();
    }

    let frame = 0;
    function tick() {
      frame++;
      ctx.clearRect(0, 0, width, height);

      for (const p of petals) {
        p.x += p.speedX + Math.sin(frame * p.swaySpeed + p.swayOffset) * p.sway * 0.05;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        drawPetal(p);

        // recycle once a petal drifts past the bottom-left / off screen
        if (p.y > height + 20 || p.x < -20) {
          Object.assign(p, makePetal(false));
        }
      }

      animationId = requestAnimationFrame(tick);
    }

    function handleResize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", handleResize);

    if (prefersReducedMotion) {
      // draw a single static frame instead of animating
      petals.forEach(drawPetal);
    } else {
      tick();
    }

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 ${className}`}
    />
  );
}

export default SakuraPetals;