// src/js/typing.js
// 打字"雨随文动"效果 - 增强可见版

export function initTypingEffects() {
  const editor = document.getElementById('mainEditor');
  if (!editor) return;

  // 创建粒子画布
  const canvas = document.createElement('canvas');
  canvas.id = 'typingCanvas';
  canvas.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 999;
  `;
  
  const container = editor.parentElement;
  container.style.position = 'relative';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    const rect = container.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
}
resize();
window.addEventListener('resize', resize);

// 延迟再次初始化，确保容器渲染完成
setTimeout(resize, 500);

  // 粒子类 - 增强版
  class Particle {
    constructor(x, y) {
      this.x = x + (Math.random() - 0.5) * 20;
      this.y = y + (Math.random() - 0.5) * 10;
      this.life = 1;
      this.decay = 0.015 + Math.random() * 0.015;
      
      // 向上飘散
      this.vx = (Math.random() - 0.5) * 3;
      this.vy = -Math.random() * 4 - 2;
      
      // 更大更亮
      this.size = Math.random() * 4 + 2;
      this.hue = 200 + Math.random() * 40; // 蓝白色系
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.08; // 轻微重力
      this.life -= this.decay;
      this.size *= 0.98; // 慢慢变小
    }

    draw(ctx) {
      if (this.life <= 0 || this.size <= 0.5) return;
      
      const alpha = this.life;
      
      // 核心光点
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 90%, ${alpha})`;
      ctx.fill();
      
      // 外发光
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.size * 3
      );
      gradient.addColorStop(0, `hsla(${this.hue}, 80%, 90%, ${alpha * 0.5})`);
      gradient.addColorStop(1, `hsla(${this.hue}, 80%, 90%, 0)`);
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  // 创建粒子
  function createParticles(x, y) {
    // 如果坐标无效，不生成
    if (x <= 0 || y <= 0 || x > canvas.width || y > canvas.height) return;
    
    const count = 5 + Math.floor(Math.random() * 5);
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y));
    }
}

  // 获取光标位置
  // 获取光标位置
function getCursorPosition() {
    const cursorPos = editor.selectionStart;
    const text = editor.value.substring(0, cursorPos);
    const lines = text.split('\n');
    const currentLine = lines[lines.length - 1];
    const lineHeight = 28;
    const charWidth = 18;
    
    let x = currentLine.length * charWidth + 20;
    let y = (lines.length - 1) * lineHeight + 30;
    
    // 限制在画布范围内
    x = Math.min(x, canvas.width - 10);
    y = Math.min(y, canvas.height - 10);
    
    return { x, y };
}

  // 监听输入
  editor.addEventListener('input', () => {
    const pos = getCursorPosition();
    createParticles(pos.x, pos.y);
  });

  // 动画循环
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles = particles.filter(p => {
      p.update();
      p.draw(ctx);
      return p.life > 0;
    });
    
    requestAnimationFrame(animate);
  }
  animate();

  console.log('✅ 雨随文动已启用（增强版）');
}