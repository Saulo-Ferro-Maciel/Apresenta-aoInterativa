import { Player } from './player.js';

const playerElement = document.getElementById('player');
const player = new Player(playerElement);
player.y = 600; // Altura inicial elevada
player.x = 130; // Posição inicial
player.vy = 3;

const gameWorld = document.getElementById('gameWorld');
const bg = document.getElementById('bg');
const mg = document.getElementById('mg');
const ground = document.querySelector('.ground');

const topLayer = document.querySelector('.dirt-layer.top');
const midLayer = document.querySelector('.dirt-layer.middle');
const botLayer = document.querySelector('.dirt-layer.bottom');

function gerarDotsPorCamada(layer, shades, count = 32) {
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    const size = Math.random() * 10 + 4;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;
    dot.style.background = shades[Math.floor(Math.random() * shades.length)];
    layer.appendChild(dot);
  }
}

// Dots no chão
gerarDotsPorCamada(topLayer, ['#8d6e63', '#795548', '#6d4c41'], 105);
gerarDotsPorCamada(midLayer, ['#6d4c41', '#5d4037', '#4e342e'], 110);
gerarDotsPorCamada(botLayer, ['#4e342e', '#3e2723', '#2e1f1b'], 115);

const speed = 6;
const maxJumps = 2;

const worldWidth = gameWorld.offsetWidth;
const viewportWidth = window.innerWidth;
let cameraX = 0;

// Plataformas agrupadas por grupo/fase
const groundRect = ground.getBoundingClientRect();
const groundHeight = groundRect.height;
const groundY = window.innerHeight - groundHeight; // Posição do topo do ground em relação à janela
const plataformas = [
  // Plataforma invisível representando o ground
  { x: 0, y: groundHeight-295, width: worldWidth, height: groundHeight, grupo: 'GROUND', visivel: true },
  // Grupo A (fase 1)
  { x: 150, y: 80, width: 120, height: 30, grupo: 'A', visivel: true },
  { x: 250, y: 200, width: 120, height: 30, grupo: 'A', visivel: true },
  { x: 5, y: 330, width: 60, height: 30, grupo: 'A', visivel: true },
  // Grupo B (fase 2)
  { x: 900, y: 25, width: 120, height: 30, grupo: 'B', visivel: false },
  { x: 1050, y: 120, width: 120, height: 30, grupo: 'B', visivel: false },
  { x: 1200, y: 220, width: 120, height: 30, grupo: 'B', visivel: false },
  { x: 1350, y: 320, width: 120, height: 30, grupo: 'B', visivel: false },
  // Grupo C (fase 3)
  { x: 1700, y: 80, width: 120, height: 30, grupo: 'C', visivel: false },
  { x: 1800, y: 180, width: 120, height: 30, grupo: 'C', visivel: false },
  { x: 1900, y: 280, width: 120, height: 30, grupo: 'C', visivel: false },
  // Grupo D (fase 4)
  { x: 2300, y: 60, width: 120, height: 30, grupo: 'D', visivel: false },
  { x: 2400, y: 160, width: 120, height: 30, grupo: 'D', visivel: false },
  { x: 2500, y: 260, width: 120, height: 30, grupo: 'D', visivel: false },
  { x: 2600, y: 360, width: 120, height: 30, grupo: 'D', visivel: false },
  // Grupo E (fase 5)
  { x: 2900, y: 100, width: 120, height: 30, grupo: 'E', visivel: false },
  { x: 3050, y: 200, width: 120, height: 30, grupo: 'E', visivel: false },
  { x: 3200, y: 300, width: 120, height: 30, grupo: 'E', visivel: false },
  // Grupo F (fase 6)
  { x: 3500, y: 80, width: 120, height: 30, grupo: 'F', visivel: false },
  { x: 3600, y: 180, width: 120, height: 30, grupo: 'F', visivel: false },
  { x: 3700, y: 280, width: 120, height: 30, grupo: 'F', visivel: false },
  // Grupo G (fase 7)
  { x: 4100, y: 60, width: 120, height: 30, grupo: 'G', visivel: false },
  { x: 4200, y: 160, width: 120, height: 30, grupo: 'G', visivel: false },
  { x: 4300, y: 260, width: 120, height: 30, grupo: 'G', visivel: false }
];

// Estrelas, cada uma com o grupo correspondente
const estrelas = [
  { x: 5, y: 360, grupo: 'A', coletada: false },
  { x: 1300, y: 320, grupo: 'B', coletada: false },
  { x: 1850, y: 270, grupo: 'C', coletada: false },
  { x: 2550, y: 350, grupo: 'D', coletada: false },
  { x: 3150, y: 290, grupo: 'E', coletada: false },
  { x: 3650, y: 270, grupo: 'F', coletada: false },
  { x: 4250, y: 250, grupo: 'G', coletada: false }
];

let ultimoGrupoExpandido = null;

// Função para criar plataformas visíveis
function desenharPlataformas() {
  document.querySelectorAll('.platform').forEach(e => e.remove());
  plataformas.forEach((p, idx) => {
    if (p.visivel) {
      const div = document.createElement('div');
      div.className = 'platform';
      div.dataset.grupo = p.grupo;
      div.dataset.idx = idx;
      div.style.left = `${p.x}px`;
      div.style.bottom = `${150 + p.y}px`;
      div.style.width = `${p.width}px`;
      div.style.height = `${p.height}px`;

      // Camadas internas
      const top = document.createElement('div');
      top.className = 'dirt-layer top';
      const middle = document.createElement('div');
      middle.className = 'dirt-layer middle';
      const bottom = document.createElement('div');
      bottom.className = 'dirt-layer bottom';

      div.appendChild(top);
      div.appendChild(middle);
      div.appendChild(bottom);

      gameWorld.appendChild(div);

      // Dots nas camadas
      gerarDotsPorCamada(top, ['#8d6e63', '#795548', '#6d4c41'], 6);
      gerarDotsPorCamada(middle, ['#6d4c41', '#5d4037', '#4e342e'], 8);
      gerarDotsPorCamada(bottom, ['#4e342e', '#3e2723', '#2e1f1b'], 10);
    }
  });
}

// Função para criar estrelas
function desenharEstrelas() {
  document.querySelectorAll('.estrela').forEach(e => e.remove());
  estrelas.forEach((e, idx) => {
    if (!e.coletada) {
      const div = document.createElement('div');
      div.className = 'estrela';
      div.dataset.idx = idx;
      div.style.left = `${e.x}px`;
      div.style.bottom = `${150 + e.y}px`;
      div.innerHTML = '⭐';
      gameWorld.appendChild(div);
    }
  });
}

// Expande a section do grupo e recolhe a anterior
function expandirSectionDoGrupo(grupo) {
  if (ultimoGrupoExpandido) {
    const anterior = document.querySelector(`.section[data-grupo="${ultimoGrupoExpandido}"]`);
    if (anterior) anterior.classList.remove('expandida');
  }
  const section = document.querySelector(`.section[data-grupo="${grupo}"]`);
  if (section) section.classList.add('expandida');
  ultimoGrupoExpandido = grupo;
}

// Detecta colisão com estrela
function checarColisaoEstrela() {
  estrelas.forEach((e, idx) => {
    if (!e.coletada &&
      player.x + 50 > e.x && player.x < e.x + 40 &&
      player.y + 50 > e.y && player.y < e.y + 40) {
      e.coletada = true;

      // Plataformas do grupo somem com animação e delays diferentes
      const plataformasDoGrupo = Array.from(document.querySelectorAll(`.platform[data-grupo="${e.grupo}"]`));
      plataformasDoGrupo.forEach((platformDiv, i) => {
        setTimeout(() => {
          platformDiv.classList.add('tremor');
          setTimeout(() => {
            platformDiv.classList.add('caindo');
            setTimeout(() => {
              platformDiv.remove();
            }, 700);
          }, 500);
        }, i * 300);
      });

      plataformas.forEach(p => {
        if (p.grupo === e.grupo) p.visivel = false;
      });

      desenharEstrelas();

      // Ativa o próximo grupo de plataformas, se existir
      const proximoGrupo = String.fromCharCode(e.grupo.charCodeAt(0) + 1);
      plataformas.forEach(p => {
        if (p.grupo === proximoGrupo) p.visivel = true;
      });
      setTimeout(desenharPlataformas, 1300 + plataformasDoGrupo.length * 300);

      setTimeout(() => {
        expandirSectionDoGrupo(e.grupo);
      }, 1300 + plataformasDoGrupo.length * 300);
    }
  });
}

function criarNuvensIniciais() {
  const sections = document.querySelectorAll(".section");
  const segundaSection = sections[1];
  const sectionX = segundaSection.offsetLeft + 300;
  for (let i = 0; i < 12; i++) {
    const cloud = document.createElement("div");
    cloud.classList.add("cloud");
    cloud.style.top = `${Math.random() * 100 + 30}px`;
    cloud.style.left = `${sectionX + i * 160}px`;
    cloud.dataset.speed = 0.8;
    const img = document.createElement("img");
    img.src = `https://raw.githubusercontent.com/Saulo-Ferro-Maciel/Apresenta-aoInterativa/main/cloud${Math.floor(Math.random() * 3) + 1}.png`;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
    img.style.opacity = "0.7";
    cloud.appendChild(img);
    gameWorld.appendChild(cloud);
  }
}

function createCloud() {
  const cloud = document.createElement("div");
  cloud.classList.add("cloud");
  cloud.style.top = `${Math.random() * 200 + 50}px`;
  cloud.style.left = `5100px`;
  cloud.dataset.speed = Math.random() * 0.5 + 0.5;
  const img = document.createElement("img");
  img.src = `https://raw.githubusercontent.com/Saulo-Ferro-Maciel/Apresenta-aoInterativa/main/cloud${Math.floor(Math.random() * 3) + 1}.png`;
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "contain";
  img.style.opacity = "0.7";
  cloud.appendChild(img);
  gameWorld.appendChild(cloud);
}

function updateClouds() {
  document.querySelectorAll(".cloud").forEach(cloud => {
    let x = parseFloat(cloud.style.left);
    x -= parseFloat(cloud.dataset.speed);
    cloud.style.left = `${x}px`;
    if (x < -150) cloud.remove();
  });
}

setInterval(() => {
  if (document.querySelectorAll(".cloud").length < 20) createCloud();
}, 2000);

function update() {
  player.update(worldWidth);

  let onPlatform = false;
  plataformas.forEach(p => {
    if (!p.visivel && p.grupo !== 'GROUND') return; // Processa a plataforma GROUND mesmo se invisível
    const playerLeft = player.x;
    const playerRight = player.x + 50;
    const playerPrevBottom = player.y - player.vy;
    const playerBottom = player.y;
    const platformTop = p.y;
    const platformLeft = p.x;
    const platformRight = p.x + p.width;
    const platformHeight = p.height;

    const isFalling = player.vy <= 0;
    const horizontallyAligned = playerRight > platformLeft && playerLeft < platformRight;
    const crossingPlatformTop = (playerPrevBottom >= platformTop + platformHeight) && (playerBottom <= platformTop + platformHeight);

    if (isFalling && horizontallyAligned && crossingPlatformTop) {
      player.y = platformTop + platformHeight;
      player.vy = 0;
      player.jumpCount = 0;
      onPlatform = true;
    }
  });

  // Aplica animação de rodar quando o jogador está se movendo e está no chão ou em uma plataforma
  if (onPlatform && player.vx !== 0) {
    playerElement.classList.add('rolar');
  } else {
    playerElement.classList.remove('rolar');
  }

  const targetCameraX = Math.min(Math.max(player.x - viewportWidth / 2, 0), worldWidth - viewportWidth);
  cameraX += (targetCameraX - cameraX) * 0.1;

  gameWorld.style.left = `-${cameraX}px`;
  bg.style.left = `-${cameraX * 0.5}px`;
  mg.style.left = `-${cameraX * 0.6}px`;
  ground.style.transform = `translateX(${-cameraX * 0.3}px)`;

  updateClouds();
  checarColisaoEstrela();
  requestAnimationFrame(update);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'd') player.moveRight(speed);
  if (e.key === 'ArrowLeft' || e.key === 'a') player.moveLeft(speed);
  if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') && player.jumpCount < maxJumps) {
    player.jump();
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'ArrowLeft' || e.key === 'a') player.stop();
});

criarNuvensIniciais();
desenharPlataformas();
desenharEstrelas();
update();