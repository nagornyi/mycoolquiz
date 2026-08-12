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

    update() {
      this.particles.forEach((p) => {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        p.opacity -= 0.02;
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

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fireworks.forEach((firework) => firework.update());
    fireworks.splice(0, fireworks.length > 5 ? fireworks.length - 5 : 0);
    if (running) {
      animationFrameId = requestAnimationFrame(loop);
    }
  }

  // Start animation
  running = true;
  fireworkIntervalId = setInterval(createFirework, 700);
  loop();

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
