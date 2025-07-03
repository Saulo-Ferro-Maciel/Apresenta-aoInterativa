import { Player } from './player.js';
import { gerarDotsPorCamada, criarPlataformas, desenharPlataformas } from './ground.js';
import { estrelas, desenharEstrelas } from './stars.js';

const playerElement = document.getElementById('player');
const player = new Player(playerElement);
player.y = 600;
player.x = 130;
player.vy = 3;

const gameWorld = document.getElementById('gameWorld');
const bg = document.getElementById('bg');
const mg = document.getElementById('mg');
const ground = document.querySelector('.ground');
const grassPrincipal = document.querySelector('.grass');

const topLayer = document.querySelector('.dirt-layer.top');
const midLayer = document.querySelector('.dirt-layer.middle');
const botLayer = document.querySelector('.dirt-layer.bottom');

// Dots no chão
gerarDotsPorCamada(topLayer, ['#8d6e63', '#795548', '#6d4c41'], 105);
gerarDotsPorCamada(midLayer, ['#6d4c41', '#5d4037', '#4e342e'], 110);
gerarDotsPorCamada(botLayer, ['#4e342e', '#3e2723', '#2e1f1b'], 115);

const speed = 6;
const maxJumps = 2;

const worldWidth = gameWorld.offsetWidth;
const groundRect = ground.getBoundingClientRect();
const groundHeight = groundRect.height;
let plataformas = criarPlataformas(worldWidth, groundHeight);
const viewportWidth = window.innerWidth;
let cameraX = 0;

let ultimoGrupoExpandido = null;

function expandirSectionDoGrupo(grupo) {
  if (ultimoGrupoExpandido) {
    const anterior = document.querySelector(`.section[data-grupo="${ultimoGrupoExpandido}"]`);
    if (anterior) anterior.classList.remove('expandida');
  }
  const section = document.querySelector(`.section[data-grupo="${grupo}"]`);
  if (section) section.classList.add('expandida');
  ultimoGrupoExpandido = grupo;
}

function checarColisaoEstrela() {
  estrelas.forEach((e, idx) => {
    if (!e.coletada &&
      player.x + 50 > e.x && player.x < e.x + 40 &&
      player.y + 50 > e.y && player.y < e.y + 40) {
      e.coletada = true;

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

      desenharEstrelas(gameWorld);

      const proximoGrupo = String.fromCharCode(e.grupo.charCodeAt(0) + 1);
      plataformas.forEach(p => {
        if (p.grupo === proximoGrupo) p.visivel = true;
      });
      setTimeout(() => {
        desenharPlataformas(gameWorld, plataformas, gerarDotsPorCamada);
      }, 1300 + plataformasDoGrupo.length * 300);

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
    if (!p.visivel) return;

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


let rolarTimeout;

document.addEventListener('keydown', (e) => {
  const tecla = e.key.toLowerCase();

  if (['arrowright', 'arrowleft', 'd', 'a', 'arrowup', 'w', ' '].includes(tecla)) {
    playerElement.classList.add('rolar');

    // Reinicia o temporizador de 5s
    clearTimeout(rolarTimeout);
    rolarTimeout = setTimeout(() => {
      playerElement.classList.remove('rolar');
    }, 1000);
  }

  if (tecla === 'arrowright' || tecla === 'd') player.moveRight(speed);
  if (tecla === 'arrowleft' || tecla === 'a') player.moveLeft(speed);
  if ((tecla === 'arrowup' || tecla === 'w' || tecla === ' ') && player.jumpCount < maxJumps) {
    player.jump();
  }
});

document.addEventListener('keyup', (e) => {
  const tecla = e.key.toLowerCase();

  if (['arrowright', 'd', 'arrowleft', 'a'].includes(tecla)) {
    player.stop();
    player.cancelRotationTimer();  // ⬅️ Para imediatamente a rotação
  }

});

criarNuvensIniciais();
desenharPlataformas(gameWorld, plataformas, gerarDotsPorCamada);
desenharEstrelas(gameWorld);
update();
