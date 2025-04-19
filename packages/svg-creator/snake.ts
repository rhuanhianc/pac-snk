import { getSnakeLength, snakeToCells } from "@snk/types/snake";
import type { Snake } from "@snk/types/snake";
import type { Point } from "@snk/types/point";
import { h } from "./xml-utils";
import { createAnimation } from "./css-utils";

export type Options = {
  colorSnake: string;
  sizeCell: number;
  sizeDot: number;
};

const lerp = (k: number, a: number, b: number) => (1 - k) * a + k * b;

export const createSnake = (
  chain: Snake[],
  { sizeCell, sizeDot, colorSnake }: Options,
  duration: number // Duration for movement animation
) => {
  const snakeN = chain[0] ? getSnakeLength(chain[0]) : 0;

  const snakeParts: Point[][] = Array.from({ length: snakeN }, () => []);

  for (const snake of chain) {
    const cells = snakeToCells(snake);
    for (let i = cells.length; i--; ) snakeParts[i].push(cells[i]);
  }

  const isPacman = colorSnake === "#FFCC00";
  const pacmanSize = sizeCell * 0.9;
  const pacmanOffset = (sizeCell - pacmanSize) / 2;
  const eyeSize = pacmanSize * 0.12;
  const mouthAnimationDuration = 500;

  const partsToRender = isPacman ? 1 : snakeParts.length;

  const svgElements: string[] = [];

  snakeParts.slice(0, partsToRender).forEach((_, i, { length }) => {
    if (isPacman && i === 0) {
      svgElements.push(
        h("rect", {
          class: `s s${i} pacman`,
          x: pacmanOffset.toFixed(1),
          y: pacmanOffset.toFixed(1),
          width: pacmanSize.toFixed(1),
          height: pacmanSize.toFixed(1),
          rx: (pacmanSize / 2).toFixed(1),
          ry: (pacmanSize / 2).toFixed(1),
        })
      );
      svgElements.push(
        h("circle", {
          class: `s s${i} pacman-eye`,
          cx: (sizeCell * 0.7).toFixed(1),
          cy: (sizeCell * 0.3).toFixed(1),
          r: eyeSize.toFixed(1),
        })
      );
    } else {
      const dMin = sizeDot * 0.8;
      const dMax = sizeCell * 0.9;
      const iMax = Math.min(4, length);
      const u = (1 - Math.min(i, iMax) / iMax) ** 2;
      const s = lerp(u, dMin, dMax);
      const m = (sizeCell - s) / 2;
      const r = Math.min(4.5, (4 * s) / sizeDot);

      svgElements.push(
        h("rect", {
          class: `s s${i}`,
          x: m.toFixed(1),
          y: m.toFixed(1),
          width: s.toFixed(1),
          height: s.toFixed(1),
          rx: r.toFixed(1),
          ry: r.toFixed(1),
        })
      );
    }
  });

  const transform = ({ x, y }: Point) =>
    `transform:translate(${x * sizeCell}px,${y * sizeCell}px)`;

  const styles = [
    `.s{
      shape-rendering: geometricPrecision;
      /* fill is applied specifically below */
      /* Remove default animation from base class */
    }`,
    `.pacman {
      fill: var(--cs); /* Pacman body color */
      /* Define the body shape, excluding the mouth wedge */
      clip-path: polygon(50% 50%, 100% 40%, 100% 0%, 0% 0%, 0% 100%, 100% 100%, 100% 60%, 50% 50%);
    }`,
    `.pacman-eye {
      fill: #fff; /* White eye */
      /* No clip-path needed for the eye */
    }`,
    `.s:not(.pacman):not(.pacman-eye) {
       fill: var(--cs);
    }`,

    isPacman
      ? `@keyframes pacman-mouth {
      0%, 100% { clip-path: polygon(50% 50%, 100% 40%, 100% 0%, 0% 0%, 0% 100%, 100% 100%, 100% 60%, 50% 50%); }
      50% { clip-path: polygon(50% 50%, 100% 0%, 0% 0%, 0% 100%, 100% 100%, 50% 50%); }
    }`
      : "",

    ...snakeParts.slice(0, partsToRender).map((positions, i) => {
      const id = `s${i}`;
      const animationName = id;
      const isHead = i === 0;

      const keyframes = removeInterpolatedPositions(
        positions.map((tr, i, { length }) => ({ ...tr, t: i / length }))
      ).map(({ t, ...p }) => {
        if (isPacman && isHead && t < 1) {
          const nextIndex = Math.min(
            Math.floor(t * positions.length) + 1,
            positions.length - 1
          );
          if (
            nextIndex > Math.floor(t * positions.length) &&
            nextIndex < positions.length
          ) {
            const nextPos = positions[nextIndex];
            const currentPos = p;
            let rotation = 0;
            if (nextPos.x > currentPos.x) rotation = 0;
            else if (nextPos.x < currentPos.x) rotation = 180;
            else if (nextPos.y > currentPos.y) rotation = 90;
            else if (nextPos.y < currentPos.y) rotation = 270;
            return {
              t,
              style: `transform: translate(${p.x * sizeCell}px, ${p.y * sizeCell}px) rotate(${rotation}deg);`,
            };
          }
        }
        return { t, style: transform(p) };
      });

      let initialTransform = transform(positions[0]);
      let initialTransformOrigin = "";
      let bodyAnimationNames = animationName;
      let bodyAnimationDurations = `${duration}ms`;
      let bodyAnimationTimingFunctions = "linear";
      let eyeAnimationNames = animationName;
      let eyeAnimationDurations = `${duration}ms`;
      let eyeAnimationTimingFunctions = "linear";

      if (isPacman && isHead) {
        if (positions.length > 1) {
          const nextPos = positions[1];
          const currentPos = positions[0];
          let rotation = 0;
          if (nextPos.x > currentPos.x) rotation = 0;
          else if (nextPos.x < currentPos.x) rotation = 180;
          else if (nextPos.y > currentPos.y) rotation = 90;
          else if (nextPos.y < currentPos.y) rotation = 270;
          initialTransform = `transform: translate(${currentPos.x * sizeCell}px, ${currentPos.y * sizeCell}px) rotate(${rotation}deg);`;
        }
        initialTransformOrigin = `transform-origin: ${(pacmanOffset + pacmanSize / 2).toFixed(1)}px ${(pacmanOffset + pacmanSize / 2).toFixed(1)}px;`;

        bodyAnimationNames = `${animationName}, pacman-mouth`;
        bodyAnimationDurations = `${duration}ms, ${mouthAnimationDuration}ms`;
        bodyAnimationTimingFunctions = "linear, steps(1, end)";
      }

      return [
        createAnimation(animationName, keyframes), // Movement keyframes

        isHead && isPacman
          ? `.s.${id}.pacman {
          ${initialTransform}
          ${initialTransformOrigin}
          animation-name: ${bodyAnimationNames};
          animation-duration: ${bodyAnimationDurations};
          animation-timing-function: ${bodyAnimationTimingFunctions};
          animation-iteration-count: infinite;
        }`
          : "",
        isHead && isPacman
          ? `.s.${id}.pacman-eye {
          ${initialTransform}
          ${initialTransformOrigin}
          animation-name: ${eyeAnimationNames};
          animation-duration: ${eyeAnimationDurations};
          animation-timing-function: ${eyeAnimationTimingFunctions};
          animation-iteration-count: infinite;
        }`
          : "",
        !isHead
          ? `.s.${id} {
          ${initialTransform}
          ${initialTransformOrigin}
          animation-name: ${animationName};
          animation-duration: ${duration}ms;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }`
          : "",
      ];
    }),
  ]
    .flat()
    .filter(Boolean);

  return { svgElements, styles };
};

const removeInterpolatedPositions = <T extends Point>(arr: T[]) =>
  arr.filter((u, i, arr) => {
    if (i - 1 < 0 || i + 1 >= arr.length) return true;

    const a = arr[i - 1];
    const b = arr[i + 1];

    const ex = (a.x + b.x) / 2;
    const ey = (a.y + b.y) / 2;

    // return true;
    return !(Math.abs(ex - u.x) < 0.01 && Math.abs(ey - u.y) < 0.01);
  });
