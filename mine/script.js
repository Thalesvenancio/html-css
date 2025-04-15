const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Configurações iniciais
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const playerCar = {
  x: canvas.width / 2,
  y: canvas.height - 100,
  width: 40,
  height: 80,
  speed: 0,
  angle: 0,
  maxSpeed: 5,
  acceleration: 0.1,
  friction: 0.05,
  turnSpeed: 3,
};

const npcCars = [];
const track = [
  { x: 100, y: 100, width: 1000, height: 20 },
  { x: 100, y: 100, width: 20, height: 600 },
  { x: 900, y: 100, width: 20, height: 600 },
  { x: 100, y: 700, width: 1000, height: 20 },
];

let keys = {};

// Event listeners para controle WASD
window.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;
});
window.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
});

// Função para desenhar o carro
function drawCar(car, color = 'blue') {
  ctx.save();
  ctx.translate(car.x, car.y);
  ctx.rotate((car.angle * Math.PI) / 180);
  ctx.fillStyle = color;
  ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height);
  ctx.restore();
}

// Função para desenhar a pista
function drawTrack() {
  ctx.fillStyle = 'gray';
  track.forEach((segment) => {
    ctx.fillRect(segment.x, segment.y, segment.width, segment.height);
  });
}

// Função para atualizar o jogador
function updatePlayer() {
  if (keys['w']) {
    playerCar.speed += playerCar.acceleration;
  }
  if (keys['s']) {
    playerCar.speed -= playerCar.acceleration;
  }
  if (keys['a']) {
    playerCar.angle -= playerCar.turnSpeed;
  }
  if (keys['d']) {
    playerCar.angle += playerCar.turnSpeed;
  }

  // Aplicar atrito
  if (playerCar.speed > 0) {
    playerCar.speed -= playerCar.friction;
  } else if (playerCar.speed < 0) {
    playerCar.speed += playerCar.friction;
  }

  // Limitar velocidade máxima
  playerCar.speed = Math.max(-playerCar.maxSpeed, Math.min(playerCar.maxSpeed, playerCar.speed));

  // Atualizar posição
  const radians = (playerCar.angle * Math.PI) / 180;
  playerCar.x += Math.cos(radians) * playerCar.speed;
  playerCar.y += Math.sin(radians) * playerCar.speed;

  // Verificar colisões com a pista
  track.forEach((segment) => {
    if (
      playerCar.x + playerCar.width / 2 > segment.x &&
      playerCar.x - playerCar.width / 2 < segment.x + segment.width &&
      playerCar.y + playerCar.height / 2 > segment.y &&
      playerCar.y - playerCar.height / 2 < segment.y + segment.height
    ) {
      playerCar.speed = 0;
    }
  });

  // Manter o carro dentro da tela
  playerCar.x = Math.max(0, Math.min(canvas.width, playerCar.x));
  playerCar.y = Math.max(0, Math.min(canvas.height, playerCar.y));
}

// Função para criar NPCs
function createNPCs(count) {
  for (let i = 0; i < count; i++) {
    npcCars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      width: 40,
      height: 80,
      speed: Math.random() * 2 + 1,
      angle: Math.random() * 360,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
    });
  }
}

// Função para atualizar NPCs
function updateNPCs() {
  npcCars.forEach((npc) => {
    const radians = (npc.angle * Math.PI) / 180;
    npc.x += Math.cos(radians) * npc.speed;
    npc.y += Math.sin(radians) * npc.speed;

    // Verificar colisões com a pista
    track.forEach((segment) => {
      if (
        npc.x + npc.width / 2 > segment.x &&
        npc.x - npc.width / 2 < segment.x + segment.width &&
        npc.y + npc.height / 2 > segment.y &&
        npc.y - npc.height / 2 < segment.y + segment.height
      ) {
        npc.speed = 0;
      }
    });

    // Manter os NPCs dentro da tela
    npc.x = Math.max(0, Math.min(canvas.width, npc.x));
    npc.y = Math.max(0, Math.min(canvas.height, npc.y));
  });
}

// Função principal do jogo
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenhar e atualizar elementos
  drawTrack();
  updatePlayer();
  drawCar(playerCar, 'blue');

  updateNPCs();
  npcCars.forEach((npc) => drawCar(npc, npc.color));

  requestAnimationFrame(gameLoop);
}

// Inicializar o jogo
createNPCs(5); // Criar 5 NPCs
gameLoop();