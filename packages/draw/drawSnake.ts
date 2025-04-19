import { snakeToCells } from "@snk/types/snake";
import type { Snake } from "@snk/types/snake";

type Options = {
  colorSnake: string;
  sizeCell: number;
};

export const drawSnake = (
  ctx: CanvasRenderingContext2D,
  snake: Snake,
  o: Options,
) => {
  const cells = snakeToCells(snake);

  if (cells.length === 0) return;

  // Desenha apenas a cabeça como Pac-Man
  const head = cells[0];
  
  ctx.save();
  ctx.fillStyle = o.colorSnake;
  
  // Posição da cabeça do Pac-Man
  const x = head.x * o.sizeCell;
  const y = head.y * o.sizeCell;
  const size = o.sizeCell * 0.9;
  
  // Calcular direção do Pac-Man com base nos próximos segmentos
  let direction = 0; // ângulo de direção em radianos (0 = direita)
  if (cells.length > 1) {
    const next = cells[1];
    if (next.x > head.x) direction = 0; // direita
    else if (next.x < head.x) direction = Math.PI; // esquerda
    else if (next.y > head.y) direction = Math.PI / 2; // baixo
    else if (next.y < head.y) direction = 3 * Math.PI / 2; // cima
  }
  
  // Ângulo da boca (animação piscando)
  const now = Date.now() / 200; // Controla velocidade da animação
  const mouthAngle = (Math.sin(now) + 1) * Math.PI/6 + Math.PI/12; // Entre PI/12 e PI/4
  
  // Desenhar Pac-Man
  ctx.translate(x + o.sizeCell/2, y + o.sizeCell/2);
  ctx.rotate(direction);
  ctx.beginPath();
  ctx.arc(0, 0, size/2, mouthAngle, 2 * Math.PI - mouthAngle);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();
  
  ctx.restore();
  
  // Não desenha o corpo para o tema Pac-Man
  if (o.colorSnake !== "#FFCC00") {
    // Desenha o corpo como esferas menores somente se não for Pac-Man
    for (let i = 1; i < cells.length; i++) {
      const size = o.sizeCell * 0.7;
      
      ctx.save();
      ctx.fillStyle = o.colorSnake;
      ctx.translate(
        cells[i].x * o.sizeCell + o.sizeCell/2, 
        cells[i].y * o.sizeCell + o.sizeCell/2
      );
      
      // Desenhar corpo como pontos menores
      ctx.beginPath();
      ctx.arc(0, 0, size/2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    }
  }
};

const lerp = (k: number, a: number, b: number) => (1 - k) * a + k * b;
const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));

export const drawSnakeLerp = (
  ctx: CanvasRenderingContext2D,
  snake0: Snake,
  snake1: Snake,
  k: number,
  o: Options,
) => {
  const m = 0.8;
  const n = snake0.length / 2;
  
  // Se não há segmentos, não desenha nada
  if (n === 0) return;
  
  // Desenha a cabeça do Pac-Man
  const x0 = snake0[0];
  const y0 = snake0[1];
  const x1 = snake1[0];
  const y1 = snake1[1];
  
  const x = lerp(k, x0, x1) - 2;
  const y = lerp(k, y0, y1) - 2;
  
  // Determinar direção do movimento
  let direction = 0;
  if (x1 > x0) direction = 0; // direita
  else if (x1 < x0) direction = Math.PI; // esquerda
  else if (y1 > y0) direction = Math.PI / 2; // baixo
  else if (y1 < y0) direction = 3 * Math.PI / 2; // cima
  
  // Ângulo da boca para animação
  const now = Date.now() / 200;
  const mouthAngle = (Math.sin(now) + 1) * Math.PI/6 + Math.PI/12;
  
  ctx.save();
  ctx.fillStyle = o.colorSnake;
  ctx.translate(
    x * o.sizeCell + o.sizeCell/2, 
    y * o.sizeCell + o.sizeCell/2
  );
  ctx.rotate(direction);
  ctx.beginPath();
  ctx.arc(0, 0, o.sizeCell * 0.45, mouthAngle, 2 * Math.PI - mouthAngle);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  
  // Não desenha o corpo para o tema Pac-Man
  if (o.colorSnake !== "#FFCC00") {
    // Desenha o corpo
    for (let i = 1; i < n; i++) {
      const ki = clamp((k - (1 - m) * (i / Math.max(n - 1, 1))) / m, 0, 1);
      
      const xi = lerp(ki, snake0[i * 2 + 0], snake1[i * 2 + 0]) - 2;
      const yi = lerp(ki, snake0[i * 2 + 1], snake1[i * 2 + 1]) - 2;
      
      ctx.save();
      ctx.fillStyle = o.colorSnake;
      ctx.translate(
        xi * o.sizeCell + o.sizeCell/2, 
        yi * o.sizeCell + o.sizeCell/2
      );
      
      // Desenhar corpo como pontos
      ctx.beginPath();
      ctx.arc(0, 0, o.sizeCell * 0.35, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    }
  }
};
