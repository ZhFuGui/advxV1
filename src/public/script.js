/**
 * ======================================================================
 * MagicTextReveal 粒子效果
 * ======================================================================
 */
class MagicTextReveal {
  constructor(container, options = {}) {
    // ... (构造函数内容保持不变) ...
    this.container = container;
    this.options = {
      text: "我要补贴",
      color: "rgba(255, 72, 0, 0.99)",
      fontSize: 100,
      fontFamily: "STHeiti, 'Microsoft YaHei', sans-serif",
      fontWeight: 700,
      density: 4,
      ...options,
    };
    this.dpr = window.devicePixelRatio || 1;
    this.particles = [];
    this.isHovered = false; // 这个状态现在由外部控制
    this.init();
  }

  init() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.container.appendChild(this.canvas);

    window.addEventListener("resize", () => this.resize());
    this.resize();
    this.animate();
  }

  resize() {
    // 因为容器现在是全屏，所以画布也是全屏
    this.canvas.width = window.innerWidth * this.dpr;
    this.canvas.height = window.innerHeight * this.dpr;
    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;
    this.createParticles();
  }

  createParticles() {
    this.particles = [];
    const { text, fontSize, fontWeight, fontFamily, color, density } =
      this.options;
    const font = `${fontWeight} ${fontSize * this.dpr}px ${fontFamily}`;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = color;
    this.ctx.font = font;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2);

    const imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    const transformedDensity = 6 - density;
    const sampleRate = Math.max(1, Math.round(this.dpr * transformedDensity));

    for (let y = 0; y < this.canvas.height; y += sampleRate) {
      for (let x = 0; x < this.canvas.width; x += sampleRate) {
        if (imageData.data[(y * this.canvas.width + x) * 4 + 3] > 0) {
          this.particles.push({
            originalX: x,
            originalY: y, 
            x: Math.random() * this.canvas.width,         // 初始随机 x
            y: Math.random() * this.canvas.height,        // 初始随机 y
            floatingAngle: Math.random() * Math.PI * 2,   // 漂浮角度
            floatingRadius: Math.random() * 150 + 50,     // 漂浮半径
            floatingSpeed: Math.random() * 0.3 + 0.1,     // 漂浮速度
            color: color,
          });
        }
      }
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach((p) => {
      let targetX, targetY;

      if (this.isHovered) {
        // 状态一：鼠标悬浮 -> 粒子汇集到目标位置
        targetX = p.originalX;
        targetY = p.originalY;
      } else {
        // 状态二：鼠标移开 -> 粒子在目标位置附近漂浮
        p.floatingAngle += p.floatingSpeed * 0.1;
        targetX = p.originalX + Math.cos(p.floatingAngle) * p.floatingRadius;
        targetY = p.originalY + Math.sin(p.floatingAngle) * p.floatingRadius;
      }

      // 使用平滑插值（Interpolation）让粒子移动更自然
      const dx = targetX - p.x;
      const dy = targetY - p.y;
      p.x += dx * 0.04; // 0.05 是缓动系数，越小越平滑
      p.y += dy * 0.04;

      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(p.x, p.y, this.dpr, this.dpr);
    });

    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================
  // 动态波浪背景
  // ==========================================================

  class Grad {
    constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
    dot2(x, y) {
      return this.x * x + this.y * y;
    }
  }
  class Noise {
    constructor(seed = 0) {
      this.grad3 = [
        new Grad(1, 1, 0),
        new Grad(-1, 1, 0),
        new Grad(1, -1, 0),
        new Grad(-1, -1, 0),
        new Grad(1, 0, 1),
        new Grad(-1, 0, 1),
        new Grad(1, 0, -1),
        new Grad(-1, 0, -1),
        new Grad(0, 1, 1),
        new Grad(0, -1, 1),
        new Grad(0, 1, -1),
        new Grad(0, -1, -1),
      ];
      this.p = [
        151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225,
        140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247,
        120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57,
        177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74,
        165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122,
        60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54,
        65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169,
        200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3,
        64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85,
        212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170,
        213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43,
        172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185,
        112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191,
        179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31,
        181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150,
        254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195,
        78, 66, 215, 61, 156, 180,
      ];
      this.perm = new Array(512);
      this.gradP = new Array(512);
      this.seed(seed);
    }
    seed(seed) {
      if (seed > 0 && seed < 1) seed *= 65536;
      seed = Math.floor(seed);
      if (seed < 256) seed |= seed << 8;
      for (let i = 0; i < 256; i++) {
        let v =
          i & 1 ? this.p[i] ^ (seed & 255) : this.p[i] ^ ((seed >> 8) & 255);
        this.perm[i] = this.perm[i + 256] = v;
        this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12];
      }
    }
    fade(t) {
      return t * t * t * (t * (t * 6 - 15) + 10);
    }
    lerp(a, b, t) {
      return (1 - t) * a + t * b;
    }
    perlin2(x, y) {
      let X = Math.floor(x),
        Y = Math.floor(y);
      x -= X;
      y -= Y;
      X &= 255;
      Y &= 255;
      const n00 = this.gradP[X + this.perm[Y]].dot2(x, y);
      const n01 = this.gradP[X + this.perm[Y + 1]].dot2(x, y - 1);
      const n10 = this.gradP[X + 1 + this.perm[Y]].dot2(x - 1, y);
      const n11 = this.gradP[X + 1 + this.perm[Y + 1]].dot2(x - 1, y - 1);
      const u = this.fade(x);
      return this.lerp(
        this.lerp(n00, n10, u),
        this.lerp(n01, n11, u),
        this.fade(y)
      );
    }
  }

  function initializeWaves() {
    const canvas = document.getElementById("waves-canvas");
    const container = document.getElementById("waves-background-container");
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    let bounding = { width: 0, height: 0, left: 0, top: 0 };
    const noise = new Noise(Math.random());
    let lines = [];
    let mouse = {
      x: -10,
      y: 0,
      lx: 0,
      ly: 0,
      sx: 0,
      sy: 0,
      v: 0,
      vs: 0,
      a: 0,
      set: false,
    };

    // 波浪的配置参数
    const config = {
      lineColor: "rgba(255, 125, 32, 0.81)",
      waveSpeedX: 0.0325,
      waveSpeedY: 0.02,
      waveAmpX: 32,
      waveAmpY: 16,
      xGap: 12,
      yGap: 36,
      friction: 0.925,
      tension: 0.005,
      maxCursorMove: 100,
    };

    function setSize() {
      bounding = container.getBoundingClientRect();
      canvas.width = bounding.width;
      canvas.height = bounding.height;
    }

    function setLines() {
      lines = [];
      const { width, height } = bounding;
      const oWidth = width + 200,
        oHeight = height + 30;
      const totalLines = Math.ceil(oWidth / config.xGap);
      const totalPoints = Math.ceil(oHeight / config.yGap);
      const xStart = (width - config.xGap * totalLines) / 2;
      const yStart = (height - config.yGap * totalPoints) / 2;
      for (let i = 0; i <= totalLines; i++) {
        const pts = [];
        for (let j = 0; j <= totalPoints; j++) {
          pts.push({
            x: xStart + config.xGap * i,
            y: yStart + config.yGap * j,
            wave: { x: 0, y: 0 },
            cursor: { x: 0, y: 0, vx: 0, vy: 0 },
          });
        }
        lines.push(pts);
      }
    }

    function movePoints(time) {
      lines.forEach((pts) => {
        pts.forEach((p) => {
          const move =
            noise.perlin2(
              (p.x + time * config.waveSpeedX) * 0.002,
              (p.y + time * config.waveSpeedY) * 0.0015
            ) * 12;
          p.wave.x = Math.cos(move) * config.waveAmpX;
          p.wave.y = Math.sin(move) * config.waveAmpY;
          const dx = p.x - mouse.sx,
            dy = p.y - mouse.sy,
            dist = Math.hypot(dx, dy),
            l = Math.max(175, mouse.vs);
          if (dist < l) {
            const s = 1 - dist / l,
              f = Math.cos(dist * 0.001) * s;
            p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00065;
            p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00065;
          }
          p.cursor.vx += (0 - p.cursor.x) * config.tension;
          p.cursor.vy += (0 - p.cursor.y) * config.tension;
          p.cursor.vx *= config.friction;
          p.cursor.vy *= config.friction;
          p.cursor.x += p.cursor.vx * 2;
          p.cursor.y += p.cursor.vy * 2;
          p.cursor.x = Math.min(
            config.maxCursorMove,
            Math.max(-config.maxCursorMove, p.cursor.x)
          );
          p.cursor.y = Math.min(
            config.maxCursorMove,
            Math.max(-config.maxCursorMove, p.cursor.y)
          );
        });
      });
    }

    function moved(point, withCursor = true) {
      const x = point.x + point.wave.x + (withCursor ? point.cursor.x : 0);
      const y = point.y + point.wave.y + (withCursor ? point.cursor.y : 0);
      return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
    }

    function drawLines() {
      const { width, height } = bounding;
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      ctx.strokeStyle = config.lineColor;
      lines.forEach((points) => {
        let p1 = moved(points[0], false);
        ctx.moveTo(p1.x, p1.y);
        points.forEach((p, idx) => {
          const isLast = idx === points.length - 1;
          p1 = moved(p, !isLast);
          const p2 = moved(
            points[idx + 1] || points[points.length - 1],
            !isLast
          );
          ctx.lineTo(p1.x, p1.y);
          if (isLast) ctx.moveTo(p2.x, p2.y);
        });
      });
      ctx.stroke();
    }

    function tick(t) {
      mouse.sx += (mouse.x - mouse.sx) * 0.1;
      mouse.sy += (mouse.y - mouse.sy) * 0.1;
      const dx = mouse.x - mouse.lx,
        dy = mouse.y - mouse.ly,
        d = Math.hypot(dx, dy);
      mouse.v = d;
      mouse.vs += (d - mouse.vs) * 0.1;
      mouse.vs = Math.min(100, mouse.vs);
      mouse.lx = mouse.x;
      mouse.ly = mouse.y;
      mouse.a = Math.atan2(dy, dx);
      movePoints(t);
      drawLines();
      requestAnimationFrame(tick);
    }

    function updateMouse(x, y) {
      mouse.x = x - bounding.left;
      mouse.y = y - bounding.top + window.scrollY;
      if (!mouse.set) {
        mouse.sx = mouse.x;
        mouse.sy = mouse.y;
        mouse.lx = mouse.x;
        mouse.ly = mouse.y;
        mouse.set = true;
      }
    }

    window.addEventListener("resize", () => {
      setSize();
      setLines();
    });
    window.addEventListener("mousemove", (e) => updateMouse(e.pageX, e.pageY));
    window.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
        updateMouse(e.touches[0].clientX, e.touches[0].clientY);
      },
      { passive: false }
    );

    // 初始化
    setSize();
    setLines();
    requestAnimationFrame(tick);
  }

  function initializeHandDrawnButton() {
    const path = document.getElementById("button-border-path");
    if (!path) return;

    const length = path.getTotalLength();

    path.style.setProperty("--path-length", length);

    path.style.strokeDasharray = length;
  }

  const actionButton = document.getElementById("action-button");
  let magicTextInstance = null;

  actionButton.addEventListener("click", () => {
    actionButton.disabled = true;
    document.body.classList.add("in-transition");

    setTimeout(() => {
      document.body.classList.remove("in-transition");
      document.body.classList.add("final-state");

      if (!magicTextInstance) {
        const container = document.getElementById("magic-text-container");
        magicTextInstance = new MagicTextReveal(container, {
          fontSize: window.innerWidth < 768 ? 60 : 100,
        });

        // 将事件监听器绑定到指定的触发区
        const triggerZone = document.getElementById("trigger-zone");
        if (triggerZone) {
          triggerZone.addEventListener("mouseenter", () => {
            // 更新实例的 isHovered 状态
            if (magicTextInstance) magicTextInstance.isHovered = true;
          });
          triggerZone.addEventListener("mouseleave", () => {
            if (magicTextInstance) magicTextInstance.isHovered = false;
          });
        }
      }
    }, 2000);
  });


  const trigger_zone = document.getElementById("trigger-zone");

  trigger_zone.addEventListener("click", () => {
    alert("p");
  });
  // --- 启动初始动画 ---
  initializeWaves();
  initializeHandDrawnButton();
});
