// src/js/cursor.js
// 光标光漩涡效果

export function initCursorEffects() {
  const canvas = document.createElement('canvas');
  canvas.id = 'cursorCanvas';
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
  `;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  let mouseX = -1000, mouseY = -1000;
  let isMoving = false;
  let moveTimeout;

  // 跟踪鼠标
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMoving = true;
    
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(() => {
      isMoving = false;
    }, 100);
  });

  // 漩涡粒子
  const swirlParticles = [];
  const trailParticles = [];

  class SwirlParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.angle = Math.random() * Math.PI * 2;
      this.radius = 3 + Math.random() * 9;
      this.speed = 0.02 + Math.random() * 0.03;
      this.size = 1 + Math.random() * 2;
      this.opacity = 0.6 + Math.random() * 0.4;
    }

    update(centerX, centerY) {
      this.angle += this.speed;
      this.radius += 0.2;
      this.opacity -= 0.01;
      
      this.x = centerX + Math.cos(this.angle) * this.radius;
      this.y = centerY + Math.sin(this.angle) * this.radius;
    }

    draw(ctx) {
      if (this.opacity <= 0) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(150, 200, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  class TrailParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.life = 1;
      this.size = 3 + Math.random() * 3;
    }

    update() {
      this.life -= 0.05;
      this.size *= 0.95;
    }

    draw(ctx) {
      if (this.life <= 0) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 230, 255, ${this.life * 0.5})`;
      ctx.fill();
    }
  }

  // 动画循环
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 光标静止时：漩涡效果
    if (!isMoving && mouseX > 0) {
      for (let i = 0; i < 1; i++) {
        swirlParticles.push(new SwirlParticle(mouseX, mouseY));
      }
    }

    // 光标移动时：拖尾效果
    if (isMoving) {
      for (let i = 0; i < 2; i++) {
        trailParticles.push(new TrailParticle(
          mouseX + (Math.random() - 0.5) * 10,
          mouseY + (Math.random() - 0.5) * 10
        ));
      }
    }

    // 更新漩涡粒子
    for (let i = swirlParticles.length - 1; i >= 0; i--) {
      swirlParticles[i].update(mouseX, mouseY);
      swirlParticles[i].draw(ctx);
      if (swirlParticles[i].opacity <= 0) {
        swirlParticles.splice(i, 1);
      }
    }

    // 更新拖尾粒子
    for (let i = trailParticles.length - 1; i >= 0; i--) {
      trailParticles[i].update();
      trailParticles[i].draw(ctx);
      if (trailParticles[i].life <= 0) {
        trailParticles.splice(i, 1);
      }
    }

    // 中心光点
    if (mouseX > 0) {
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200, 230, 255, 0.8)';
      ctx.shadowColor = 'rgba(150, 200, 255, 0.8)';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(animate);
  }
  animate();

  console.log('✅ 光标光漩涡已启用');
}