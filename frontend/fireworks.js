// Canvas-based fireworks animation, adapted to accept its target elements
// directly instead of looking them up by id/class, so it can be driven from
// a Preact component via refs.

let animationFrameId; // Store the animation frame ID
let fireworkIntervalId; // Store the interval ID for creating fireworks
let running = false; // Track if the animation is running

export function startFireworks(canvas) {
  const ctx = canvas.getContext('2d');

  // Cover the full viewport so fireworks aren't confined to the score card
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Firework {
    constructor(x, y, colors) {
      this.x = x;
      this.y = y;
      this.colors = colors;
      this.particles = [];
      for (let i = 0; i < 100; i++) {
        this.particles.push({
          x: this.x,
          y: this.y,
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 3 + 1,
          radius: Math.random() * 2,
          opacity: 1,
        });
      }
    }

    drawParticle(p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.colors[0]},${this.colors[1]},${this.colors[2]},${p.opacity})`;
      ctx.fill();
    }

    // `speed` and the opacity decay rate are tuned per frame at 60fps, so we
    // scale movement by how many "60fps frames" actually elapsed. Without
    // this, the animation runs faster on higher refresh-rate displays
    update(frameFactor) {
      this.particles.forEach((p) => {
        p.x += Math.cos(p.angle) * p.speed * frameFactor;
        p.y += Math.sin(p.angle) * p.speed * frameFactor;
        p.opacity -= 0.02 * frameFactor;
        if (p.opacity > 0) this.drawParticle(p);
      });
      this.particles = this.particles.filter((p) => p.opacity > 0);
    }
  }

  const fireworks = [];
  function createFirework() {
    const x = Math.random() * canvas.width;
    const y = (Math.random() * canvas.height) / 2;
    const colors = [
      Math.random() * 255,
      Math.random() * 255,
      Math.random() * 255,
    ];
    fireworks.push(new Firework(x, y, colors));
  }

  function loop(timestamp) {
    if (loop.lastTime === undefined) loop.lastTime = timestamp;
    const deltaTime = timestamp - loop.lastTime;
    loop.lastTime = timestamp;
    // Frames elapsed relative to a 60fps baseline, capped so a dropped/late
    // frame (e.g. tab backgrounded) doesn't cause a big visual jump.
    const frameFactor = Math.min(deltaTime / (1000 / 60), 4);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fireworks.forEach((firework) => firework.update(frameFactor));
    fireworks.splice(0, fireworks.length > 5 ? fireworks.length - 5 : 0);
    if (running) {
      animationFrameId = requestAnimationFrame(loop);
    }
  }

  // Start animation
  running = true;
  fireworkIntervalId = setInterval(createFirework, 700);
  animationFrameId = requestAnimationFrame(loop);

  // Keep resize listener cleanup available to stopFireworks via closure
  startFireworks._resizeCanvas = resizeCanvas;
}

export function stopFireworks(canvas) {
  running = false; // Stop the loop
  cancelAnimationFrame(animationFrameId); // Cancel the animation frame
  clearInterval(fireworkIntervalId); // Clear the interval for creating fireworks
  if (startFireworks._resizeCanvas) {
    window.removeEventListener('resize', startFireworks._resizeCanvas);
    startFireworks._resizeCanvas = null;
  }
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  }
}
