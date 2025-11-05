'use client';

import { useEffect, useState, useRef } from 'react';
type Brick = {
  x: number;
  y: number;
  w: number;
  h: number;
  color: 'red' | 'yellow' | 'green' | 'purple';
  score: number;
  alive: boolean;
};

const COLOR_SCORE: Record<Brick['color'], number> = {
  red: 10,
  yellow: 20,
  green: 30,
  purple: 100,
};

export default function BrickGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [cw, setCw] = useState<number>(0);
  const [ch, setCh] = useState<number>(0);

  const [initStart, setInitStart] = useState(true);
  const [started, setStarted] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const rafId = useRef<number | null>(null);

  const paddleX = useRef(0);
  const paddleW = useRef(0);
  const paddleH = useRef(0);
  const paddleSpeed = useRef(0);

  const rightPressed = useRef(false);
  const leftPressed = useRef(false);

  const ballX = useRef(0);
  const ballY = useRef(0);
  const ballVX = useRef(0);
  const ballVY = useRef(0);
  const ballR = useRef(0);

  const bricksRef = useRef<Brick[]>([]);
  const bricksAlive = useRef(0);

  const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));

  const cancelLoop = () => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  };
  const scale = 0.7;

  const computeCanvasSize = () => {
    const w = clamp(Math.floor(window.innerWidth * 0.9 * scale), 320, 1400);
    const h = clamp(Math.floor(window.innerHeight * 0.6 * scale), 240, 900);
    setCw(w);
    setCh(h);
  };

  const initPaddle = () => {
    paddleW.current = Math.floor(cw * 0.16);
    paddleH.current = Math.max(10, Math.floor(ch * 0.03));
    paddleX.current = Math.floor((cw - paddleW.current) / 2);
    paddleSpeed.current = Math.max(5, Math.floor(cw * 0.012));
  };

  const initBall = () => {
    ballR.current = Math.max(6, Math.floor(Math.min(cw, ch) * 0.025));
    ballX.current = Math.floor(cw / 2);
    ballY.current = Math.floor(ch * 0.66);
    const base = Math.max(3, Math.floor(Math.min(cw, ch) * 0.006));
    ballVX.current = (Math.random() < 0.5 ? -1 : 1) * base;
    ballVY.current = -base;
  };

  const initBricks = () => {
    const pad = Math.max(6, Math.floor(cw * 0.012));
    const offsetTop = Math.max(24, Math.floor(ch * 0.06));
    const offsetSide = Math.max(12, Math.floor(cw * 0.02));

    const brickW = Math.max(48, Math.floor(cw * 0.09));
    const brickH = Math.max(16, Math.floor(ch * 0.04));

    const usableW = cw - offsetSide * 2 + pad;
    const cols = clamp(Math.floor(usableW / (brickW + pad)), 4, 14);

    const areaH = Math.floor(ch * 0.38);
    const rows = clamp(Math.floor((areaH - offsetTop) / (brickH + pad)), 3, 10);

    const colorByRow = (r: number): Brick['color'] => {
      const topRatio = r / Math.max(1, rows - 1);
      if (topRatio < 0.25) return 'purple';
      if (topRatio < 0.5) return 'green';
      if (topRatio < 0.75) return 'yellow';
      return 'red';
    };

    const bricks: Brick[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = offsetSide + c * (brickW + pad);
        const y = offsetTop + r * (brickH + pad);
        const color = colorByRow(r);
        bricks.push({
          x,
          y,
          w: brickW,
          h: brickH,
          color,
          score: COLOR_SCORE[color],
          alive: true,
        });
      }
    }
    bricksRef.current = bricks;
    bricksAlive.current = bricks.length;
  };

  const fullInit = () => {
    initPaddle();
    initBall();
    initBricks();
    setScore(0);
    setCleared(false);
    setGameOver(false);
  };

  useEffect(() => {
    if (!started) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') rightPressed.current = true;
      if (e.key === 'ArrowLeft') leftPressed.current = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') rightPressed.current = false;
      if (e.key === 'ArrowLeft') leftPressed.current = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [started]);

  const movePaddle = () => {
    if (rightPressed.current)
      paddleX.current = Math.min(
        cw - paddleW.current,
        paddleX.current + paddleSpeed.current,
      );
    if (leftPressed.current)
      paddleX.current = Math.max(0, paddleX.current - paddleSpeed.current);
  };

  const collideBricks = () => {
    for (let i = 0; i < bricksRef.current.length; i++) {
      const b = bricksRef.current[i];
      if (!b.alive) continue;
      if (
        ballX.current + ballR.current > b.x &&
        ballX.current - ballR.current < b.x + b.w &&
        ballY.current + ballR.current > b.y &&
        ballY.current - ballR.current < b.y + b.h
      ) {
        const prevX = ballX.current - ballVX.current;
        const prevY = ballY.current - ballVY.current;
        const hitFromSide =
          prevY + ballR.current > b.y &&
          prevY - ballR.current < b.y + b.h &&
          (prevX <= b.x || prevX >= b.x + b.w);

        if (hitFromSide) ballVX.current *= -1;
        else ballVY.current *= -1;

        b.alive = false;
        bricksAlive.current -= 1;
        setScore((s) => s + b.score);

        if (bricksAlive.current <= 0) {
          setCleared(true);
          stopLoop();
        }
        break;
      }
    }
  };

  const updateBall = () => {
    ballX.current += ballVX.current;
    ballY.current += ballVY.current;

    if (
      ballX.current - ballR.current <= 0 ||
      ballX.current + ballR.current >= cw
    ) {
      ballVX.current *= -1;
      ballX.current = clamp(ballX.current, ballR.current, cw - ballR.current);
    }
    if (ballY.current - ballR.current <= 0) {
      ballVY.current *= -1;
      ballY.current = ballR.current;
    }

    const px = paddleX.current;
    const py = ch - paddleH.current - 4;
    if (
      ballY.current + ballR.current >= py &&
      ballY.current + ballR.current <=
        py + paddleH.current + Math.abs(ballVY.current) &&
      ballX.current >= px &&
      ballX.current <= px + paddleW.current &&
      ballVY.current > 0
    ) {
      const hitRatio =
        (ballX.current - (px + paddleW.current / 2)) / (paddleW.current / 2); // -1 ~ 1
      ballVY.current *= -1;
      ballVX.current +=
        hitRatio * Math.max(0.5, Math.abs(ballVX.current) * 0.2);
      // 속도 상한
      const maxSpd = Math.max(6, Math.floor(Math.min(cw, ch) * 0.015));
      ballVX.current = clamp(ballVX.current, -maxSpd, maxSpd);
    }

    if (ballY.current - ballR.current > ch + ballR.current * 2) {
      setGameOver(true);
      stopLoop();
    }
  };

  const drawScene = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.clearRect(0, 0, cw, ch);

    ctx.fillStyle = '#0b0f1a';
    ctx.fillRect(0, 0, cw, ch);

    for (const b of bricksRef.current) {
      if (!b.alive) continue;
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, b.w, b.h);
    }

    ctx.fillStyle = '#35c2ff';
    const py = ch - paddleH.current - 4;
    ctx.fillRect(paddleX.current, py, paddleW.current, paddleH.current);

    ctx.beginPath();
    ctx.arc(ballX.current, ballY.current, ballR.current, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  };

  const tick = () => {
    movePaddle();
    updateBall();
    collideBricks();
    drawScene();

    if (!gameOver && !cleared) {
      rafId.current = requestAnimationFrame(tick);
    }
  };

  const stopLoop = () => {
    cancelLoop();
    drawScene();
  };

  const startGame = () => {
    computeCanvasSize();
    setStarted(true);
    setInitStart(false);
  };

  useEffect(() => {
    if (!started || cw === 0 || ch === 0) return;

    const canvas = canvasRef.current!;
    console.log(canvas);
    canvas.width = cw;
    canvas.height = ch;
    ctxRef.current = canvas.getContext('2d');

    fullInit();
    cancelLoop();
    rafId.current = requestAnimationFrame(tick);

    return () => {
      cancelLoop();
    };
  }, [started, cw, ch]);

  const restart = () => {
    setStarted(false);
    setCleared(false);
    setGameOver(false);

    setTimeout(() => {
      setScore(0);
      setStarted(true);
    }, 0);
  };
  return (
    <div className="brick-game-container">
      <h2 className="game-title">Brick Break Game</h2>
      <canvas ref={canvasRef} className="canvas" />
      {initStart && (
        <div className="start-info">
          <button className="start-btn" onClick={startGame}>
            Start
          </button>
          <p className="start-des">⬅️➡️ 방향키로 패들을 움직이세요</p>
        </div>
      )}

      {(cleared || gameOver) && (
        <div className="game-end-info">
          <p className="result">{cleared ? '✨ CLEAR!' : '💀 GAME OVER'}</p>
          <p className="score">
            Score: <b>{score}</b>
          </p>
          <button className="restart-btn" onClick={restart}>
            Restart
          </button>
        </div>
      )}

      <div className="point-info">
        {(['purple', 'green', 'yellow', 'red'] as Brick['color'][]).map((c) => (
          <div className="point-des" key={c}>
            <span className="colors" data-colors={c} />
            <span className="colors-score">
              {c} = {COLOR_SCORE[c]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
