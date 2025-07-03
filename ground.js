export function gerarDotsPorCamada(layer, shades, count = 32) {
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

export function criarPlataformas(worldWidth, groundHeight) {
  return [
    { x: 150, y: 80, width: 120, height: 30, grupo: 'A', visivel: true },
    { x: 250, y: 200, width: 120, height: 30, grupo: 'A', visivel: true },
    { x: 5, y: 330, width: 60, height: 30, grupo: 'A', visivel: true },
    { x: 900, y: 25, width: 120, height: 30, grupo: 'B', visivel: false },
    { x: 1050, y: 120, width: 120, height: 30, grupo: 'B', visivel: false },
    { x: 1200, y: 220, width: 120, height: 30, grupo: 'B', visivel: false },
    { x: 1350, y: 320, width: 120, height: 30, grupo: 'B', visivel: false },
    { x: 1700, y: 80, width: 120, height: 30, grupo: 'C', visivel: false },
    { x: 1800, y: 180, width: 120, height: 30, grupo: 'C', visivel: false },
    { x: 1900, y: 280, width: 120, height: 30, grupo: 'C', visivel: false },
    { x: 2300, y: 60, width: 120, height: 30, grupo: 'D', visivel: false },
    { x: 2400, y: 160, width: 120, height: 30, grupo: 'D', visivel: false },
    { x: 2500, y: 260, width: 120, height: 30, grupo: 'D', visivel: false },
    { x: 2600, y: 360, width: 120, height: 30, grupo: 'D', visivel: false },
    { x: 2900, y: 100, width: 120, height: 30, grupo: 'E', visivel: false },
    { x: 3050, y: 200, width: 120, height: 30, grupo: 'E', visivel: false },
    { x: 3200, y: 300, width: 120, height: 30, grupo: 'E', visivel: false },
    { x: 3500, y: 80, width: 120, height: 30, grupo: 'F', visivel: false },
    { x: 3600, y: 180, width: 120, height: 30, grupo: 'F', visivel: false },
    { x: 3700, y: 280, width: 120, height: 30, grupo: 'F', visivel: false },
    { x: 4100, y: 60, width: 120, height: 30, grupo: 'G', visivel: false },
    { x: 4200, y: 160, width: 120, height: 30, grupo: 'G', visivel: false },
    { x: 4300, y: 260, width: 120, height: 30, grupo: 'G', visivel: false }
  ];
}

export function desenharPlataformas(gameWorld, plataformas, gerarDotsPorCamada) {
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
      gerarDotsPorCamada(top, ['#8d6e63', '#795548', '#6d4c41'], 5);
      gerarDotsPorCamada(middle, ['#6d4c41', '#5d4037', '#4e342e'], 50);
      gerarDotsPorCamada(bottom, ['#4e342e', '#3e2723', '#2e1f1b'], 100);
    }
  });
}