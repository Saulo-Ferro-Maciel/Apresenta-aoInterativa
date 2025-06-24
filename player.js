export class Player {
  constructor(element) {
    this.el = element;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.gravity = -1;
    this.jumpStrength = 20;
    this.maxJumps = 2;
    this.jumpCount = 0;
    this.groundY = 0;
    this.facing = 1; // 1 = direita, -1 = esquerda
    this.setupVisual();
    this.setPosition(this.x, this.y);
  }

  setupVisual() {
    this.el.textContent = "⚽";
    this.el.style.fontSize = "48px";
    this.el.style.background = "none";
    this.el.style.borderRadius = "50%";
    this.el.style.display = "flex";
    this.el.style.alignItems = "center";
    this.el.style.justifyContent = "center";
    this.el.style.position = "absolute";
    this.el.style.width = "50px";
    this.el.style.height = "50px";
    this.el.style.userSelect = "none";
    this.el.style.zIndex = "15";
    this.el.style.transition = "transform 0.2s";
    this.el.style.setProperty('--facing', this.facing);
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this.el.style.left = `${x}px`;
    this.el.style.bottom = `${150 + y}px`;
  }

  update(worldWidth) {
    this.x += this.vx;
    this.vy += this.gravity;
    this.y += this.vy;

    if (this.x < 0) this.x = 0;
    if (this.x > worldWidth - 50) this.x = worldWidth - 50;

    if (this.y <= this.groundY) {
      this.y = this.groundY;
      this.vy = 0;
      this.jumpCount = 0;
      this.el.classList.remove('saltando');
      if (this.vx === 0) this.el.classList.remove('andando');
    }

    this.setPosition(this.x, this.y);
  }

  jump() {
    if (this.jumpCount < this.maxJumps) {
      this.vy = this.jumpStrength;
      this.jumpCount++;
      this.setJumpingAnimation();
    }
  }

  moveLeft(speed) {
    this.vx = -speed;
    this.facing = -1;
    this.updateDirection();
    this.setWalkingAnimation();
  }

  moveRight(speed) {
    this.vx = speed;
    this.facing = 1;
    this.updateDirection();
    this.setWalkingAnimation();
  }

  stop() {
    this.vx = 0;
    this.el.classList.remove('andando');
  }

  updateDirection() {
    this.el.style.setProperty('--facing', this.facing);
    this.el.style.transform = `scaleX(${this.facing})`;
  }

  setWalkingAnimation() {
    this.el.classList.add('andando');
    this.el.classList.remove('saltando');
  }

  setJumpingAnimation() {
    this.el.classList.add('saltando');
    this.el.classList.remove('andando');
  }
}