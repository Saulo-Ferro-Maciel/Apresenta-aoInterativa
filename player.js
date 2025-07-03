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
    this.rotationTimeout = null; // ⬅️ Novo: controle do tempo de rotação
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
    }

    this.setPosition(this.x, this.y);
  }

  jump() {
    if (this.jumpCount < this.maxJumps) {
      this.vy = this.jumpStrength;
      this.jumpCount++;
      this.setJumpingAnimation();
      this.startRotationTimer(); // ⬅️ inicia controle do tempo
    }
  }

  moveLeft(speed) {
    this.vx = -speed;
    this.setWalkingAnimation('esquerda');
    this.startRotationTimer(); // ⬅️ inicia controle do tempo
  }

  moveRight(speed) {
    this.vx = speed;
    this.setWalkingAnimation('direita');
    this.startRotationTimer(); // ⬅️ inicia controle do tempo
  }

  stop() {
    this.vx = 0;
    // rotação controlada por tempo, não remove aqui
  }

  setWalkingAnimation(direcao) {
    this.el.classList.remove('saltando');
    if (direcao === 'direita') {
      this.el.classList.add('girando-direita');
      this.el.classList.remove('girando-esquerda');
    } else {
      this.el.classList.add('girando-esquerda');
      this.el.classList.remove('girando-direita');
    }
  }

  setJumpingAnimation() {
    this.el.classList.add('saltando');
    this.el.classList.remove('girando-direita', 'girando-esquerda');
  }

  clearRotation() {
    this.el.classList.remove('girando-direita', 'girando-esquerda');
  }
  cancelRotationTimer() {
    if (this.rotationTimeout) {
      clearTimeout(this.rotationTimeout);
      this.rotationTimeout = null;
    }
    this.clearRotation();
  }
  
  startRotationTimer() {
    if (this.rotationTimeout) clearTimeout(this.rotationTimeout);
    this.rotationTimeout = setTimeout(() => {
      this.clearRotation();
    }, 5000);
  }
}
