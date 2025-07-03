// Array de estrelas
export const estrelas = [
  { x: 5, y: 360, grupo: 'A', coletada: false },
  { x: 1300, y: 320, grupo: 'B', coletada: false },
  { x: 1850, y: 270, grupo: 'C', coletada: false },
  { x: 2550, y: 350, grupo: 'D', coletada: false },
  { x: 3150, y: 290, grupo: 'E', coletada: false },
  { x: 3650, y: 270, grupo: 'F', coletada: false },
  { x: 4250, y: 250, grupo: 'G', coletada: false }
];

// Função para desenhar estrelas
export function desenharEstrelas(gameWorld) {
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