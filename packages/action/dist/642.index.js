"use strict";
exports.id = 642;
exports.ids = [642];
exports.modules = {

/***/ 3642:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  createGif: () => (/* binding */ createGif)
});

// EXTERNAL MODULE: external "fs"
var external_fs_ = __webpack_require__(9896);
var external_fs_default = /*#__PURE__*/__webpack_require__.n(external_fs_);
// EXTERNAL MODULE: external "path"
var external_path_ = __webpack_require__(6928);
var external_path_default = /*#__PURE__*/__webpack_require__.n(external_path_);
// EXTERNAL MODULE: external "child_process"
var external_child_process_ = __webpack_require__(5317);
// EXTERNAL MODULE: external "canvas"
var external_canvas_ = __webpack_require__(9919);
// EXTERNAL MODULE: ../types/grid.ts
var types_grid = __webpack_require__(105);
;// CONCATENATED MODULE: ../draw/pathRoundedRect.ts
const pathRoundedRect = (ctx, width, height, borderRadius) => {
    ctx.moveTo(borderRadius, 0);
    ctx.arcTo(width, 0, width, height, borderRadius);
    ctx.arcTo(width, height, 0, height, borderRadius);
    ctx.arcTo(0, height, 0, 0, borderRadius);
    ctx.arcTo(0, 0, width, 0, borderRadius);
};

;// CONCATENATED MODULE: ../draw/drawGrid.ts


const drawGrid_drawGrid = (ctx, grid, cells, o) => {
    for (let x = grid.width; x--;)
        for (let y = grid.height; y--;) {
            if (!cells || cells.some((c) => c.x === x && c.y === y)) {
                const c = (0,types_grid/* getColor */.oU)(grid, x, y);
                // @ts-ignore
                const color = !c ? o.colorEmpty : o.colorDots[c];
                ctx.save();
                ctx.translate(x * o.sizeCell + (o.sizeCell - o.sizeDot) / 2, y * o.sizeCell + (o.sizeCell - o.sizeDot) / 2);
                ctx.fillStyle = color;
                ctx.strokeStyle = o.colorDotBorder;
                ctx.lineWidth = 1;
                ctx.beginPath();
                pathRoundedRect(ctx, o.sizeDot, o.sizeDot, o.sizeDotBorderRadius);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
        }
};

;// CONCATENATED MODULE: ../draw/drawSnake.ts

const drawSnake_drawSnake = (ctx, snake, o) => {
    const cells = snakeToCells(snake);
    if (cells.length === 0)
        return;
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
        if (next.x > head.x)
            direction = 0; // direita
        else if (next.x < head.x)
            direction = Math.PI; // esquerda
        else if (next.y > head.y)
            direction = Math.PI / 2; // baixo
        else if (next.y < head.y)
            direction = 3 * Math.PI / 2; // cima
    }
    // Ângulo da boca (animação piscando)
    const now = Date.now() / 200; // Controla velocidade da animação
    const mouthAngle = (Math.sin(now) + 1) * Math.PI / 6 + Math.PI / 12; // Entre PI/12 e PI/4
    // Desenhar Pac-Man
    ctx.translate(x + o.sizeCell / 2, y + o.sizeCell / 2);
    ctx.rotate(direction);
    ctx.beginPath();
    ctx.arc(0, 0, size / 2, mouthAngle, 2 * Math.PI - mouthAngle);
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
            ctx.translate(cells[i].x * o.sizeCell + o.sizeCell / 2, cells[i].y * o.sizeCell + o.sizeCell / 2);
            // Desenhar corpo como pontos menores
            ctx.beginPath();
            ctx.arc(0, 0, size / 2, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
        }
    }
};
const lerp = (k, a, b) => (1 - k) * a + k * b;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const drawSnakeLerp = (ctx, snake0, snake1, k, o) => {
    const m = 0.8;
    const n = snake0.length / 2;
    // Se não há segmentos, não desenha nada
    if (n === 0)
        return;
    // Desenha a cabeça do Pac-Man
    const x0 = snake0[0];
    const y0 = snake0[1];
    const x1 = snake1[0];
    const y1 = snake1[1];
    const x = lerp(k, x0, x1) - 2;
    const y = lerp(k, y0, y1) - 2;
    // Determinar direção do movimento
    let direction = 0;
    if (x1 > x0)
        direction = 0; // direita
    else if (x1 < x0)
        direction = Math.PI; // esquerda
    else if (y1 > y0)
        direction = Math.PI / 2; // baixo
    else if (y1 < y0)
        direction = 3 * Math.PI / 2; // cima
    const now = Date.now() / 200;
    const mouthAngle = (Math.sin(now) + 1) * Math.PI / 6 + Math.PI / 12;
    ctx.save();
    ctx.fillStyle = o.colorSnake;
    ctx.translate(x * o.sizeCell + o.sizeCell / 2, y * o.sizeCell + o.sizeCell / 2);
    ctx.rotate(direction);
    ctx.beginPath();
    ctx.arc(0, 0, o.sizeCell * 0.45, mouthAngle, 2 * Math.PI - mouthAngle);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    if (o.colorSnake !== "#FFCC00") {
        for (let i = 1; i < n; i++) {
            const ki = clamp((k - (1 - m) * (i / Math.max(n - 1, 1))) / m, 0, 1);
            const xi = lerp(ki, snake0[i * 2 + 0], snake1[i * 2 + 0]) - 2;
            const yi = lerp(ki, snake0[i * 2 + 1], snake1[i * 2 + 1]) - 2;
            ctx.save();
            ctx.fillStyle = o.colorSnake;
            ctx.translate(xi * o.sizeCell + o.sizeCell / 2, yi * o.sizeCell + o.sizeCell / 2);
            ctx.beginPath();
            ctx.arc(0, 0, o.sizeCell * 0.35, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
        }
    }
};

;// CONCATENATED MODULE: ../draw/drawWorld.ts


const drawStack = (ctx, stack, max, width, o) => {
    ctx.save();
    const m = width / max;
    for (let i = 0; i < stack.length; i++) {
        // @ts-ignore
        ctx.fillStyle = o.colorDots[stack[i]];
        ctx.fillRect(i * m, 0, m + width * 0.005, 10);
    }
    ctx.restore();
};
const drawWorld = (ctx, grid, cells, snake, stack, o) => {
    ctx.save();
    ctx.translate(1 * o.sizeCell, 2 * o.sizeCell);
    drawGrid(ctx, grid, cells, o);
    drawSnake(ctx, snake, o);
    ctx.restore();
    ctx.save();
    ctx.translate(o.sizeCell, (grid.height + 4) * o.sizeCell);
    const max = grid.data.reduce((sum, x) => sum + +!!x, stack.length);
    drawStack(ctx, stack, max, grid.width * o.sizeCell, o);
    ctx.restore();
    // ctx.save();
    // ctx.translate(o.sizeCell + 100, (grid.height + 4) * o.sizeCell + 100);
    // ctx.scale(0.6, 0.6);
    // drawCircleStack(ctx, stack, o);
    // ctx.restore();
};
const drawLerpWorld = (ctx, grid, cells, snake0, snake1, stack, k, o) => {
    ctx.save();
    ctx.translate(1 * o.sizeCell, 2 * o.sizeCell);
    drawGrid_drawGrid(ctx, grid, cells, o);
    drawSnakeLerp(ctx, snake0, snake1, k, o);
    ctx.translate(0, (grid.height + 2) * o.sizeCell);
    const max = grid.data.reduce((sum, x) => sum + +!!x, stack.length);
    drawStack(ctx, stack, max, grid.width * o.sizeCell, o);
    ctx.restore();
};
const getCanvasWorldSize = (grid, o) => {
    const width = o.sizeCell * (grid.width + 2);
    const height = o.sizeCell * (grid.height + 4) + 30;
    return { width, height };
};

// EXTERNAL MODULE: ../types/snake.ts
var types_snake = __webpack_require__(777);
;// CONCATENATED MODULE: ../solver/step.ts


const step = (grid, stack, snake) => {
    const x = (0,types_snake/* getHeadX */.tN)(snake);
    const y = (0,types_snake/* getHeadY */.Ap)(snake);
    const color = (0,types_grid/* getColor */.oU)(grid, x, y);
    if ((0,types_grid/* isInside */.FK)(grid, x, y) && !(0,types_grid/* isEmpty */.Im)(color)) {
        stack.push(color);
        (0,types_grid/* setColorEmpty */.l$)(grid, x, y);
    }
};

// EXTERNAL MODULE: ../../node_modules/tmp/lib/tmp.js
var tmp = __webpack_require__(2644);
// EXTERNAL MODULE: external "gifsicle"
var external_gifsicle_ = __webpack_require__(5667);
var external_gifsicle_default = /*#__PURE__*/__webpack_require__.n(external_gifsicle_);
// EXTERNAL MODULE: ../../node_modules/gif-encoder-2/index.js
var gif_encoder_2 = __webpack_require__(1680);
var gif_encoder_2_default = /*#__PURE__*/__webpack_require__.n(gif_encoder_2);
;// CONCATENATED MODULE: ../gif-creator/index.ts









// @ts-ignore

const withTmpDir = async (handler) => {
    const { name: dir, removeCallback: cleanUp } = tmp.dirSync({
        unsafeCleanup: true,
    });
    try {
        return await handler(dir);
    }
    finally {
        cleanUp();
    }
};
const createGif = async (grid0, cells, chain, drawOptions, animationOptions) => withTmpDir(async (dir) => {
    const { width, height } = getCanvasWorldSize(grid0, drawOptions);
    const canvas = (0,external_canvas_.createCanvas)(width, height);
    const ctx = canvas.getContext("2d");
    const grid = (0,types_grid/* copyGrid */.mi)(grid0);
    const stack = [];
    const encoder = new (gif_encoder_2_default())(width, height, "neuquant", true);
    encoder.setRepeat(0);
    encoder.setDelay(animationOptions.frameDuration);
    encoder.start();
    for (let i = 0; i < chain.length; i += 1) {
        const snake0 = chain[i];
        const snake1 = chain[Math.min(chain.length - 1, i + 1)];
        step(grid, stack, snake0);
        for (let k = 0; k < animationOptions.step; k++) {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, width, height);
            drawLerpWorld(ctx, grid, cells, snake0, snake1, stack, k / animationOptions.step, drawOptions);
            encoder.addFrame(ctx);
        }
    }
    const outFileName = external_path_default().join(dir, "out.gif");
    const optimizedFileName = external_path_default().join(dir, "out.optimized.gif");
    encoder.finish();
    external_fs_default().writeFileSync(outFileName, encoder.out.getData());
    (0,external_child_process_.execFileSync)((external_gifsicle_default()), [
        //
        "--optimize=3",
        "--color-method=diversity",
        "--colors=18",
        outFileName,
        ["--output", optimizedFileName],
    ].flat());
    return new Uint8Array(external_fs_default().readFileSync(optimizedFileName));
});


/***/ })

};
;