'use client';

import { useEffect, useRef, useState } from 'react';

type Ball = {
  n: number;
  x: number;
  y: number;
};

export default function AimTest() {
  const [phase, setPhase] = useState<'ready' | 'count' | 'play' | 'done'>(
    'ready',
  );
  const [count, setCount] = useState(3);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [target, setTarget] = useState(1);
  const boxRef = useRef<HTMLDivElement>(null);
  const startRef = useRef(0);
  const endRef = useRef(0);

  const start = () => {
    setPhase('count');
    setCount(3);
  };

  useEffect(() => {
    if (phase !== 'count') return;
    if (count === 0) {
      setPhase('play');
      return;
    }
    const t = setTimeout(() => setCount((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, count]);

  useEffect(() => {
    if (phase !== 'play') return;
    makeBalls();
    startRef.current = performance.now();
  }, [phase]);

  const makeBalls = () => {
    const box = boxRef.current;
    if (!box) return;
    const r = 25;
    const w = box.clientWidth;
    const h = box.clientHeight;
    const arr: Ball[] = [];
    while (arr.length < 7) {
      const x = Math.random() * (w - r * 2) + r;
      const y = Math.random() * (h - r * 2) + r;
      const ok = arr.every((b) => {
        const dx = b.x - x;
        const dy = b.y - y;
        return Math.sqrt(dx * dx + dy * dy) > r * 2;
      });
      if (ok) arr.push({ n: arr.length + 1, x, y });
    }
    setBalls(arr);
    setTarget(1);
  };

  const clickBall = (n: number) => {
    if (n !== target) return;

    setBalls((prev) => prev.filter((b) => b.n !== n));

    if (target === 7) {
      endRef.current = performance.now();
      setPhase('done');
    } else {
      setTarget(n + 1);
    }
  };

  const restart = () => {
    setPhase('ready');
    setBalls([]);
    setTarget(1);
    setCount(3);
  };

  return (
    <div className="aimtest-game-container">
      <h2 className="game-title">Aim Game</h2>
      {phase === 'ready' && (
        <div className="btn-container">
          <button className="start-btn" onClick={start}>
            시작
          </button>
        </div>
      )}

      <div ref={boxRef} className="game-screen">
        {phase === 'count' && <div className="count">{count}</div>}
        {phase === 'play' &&
          balls.map((b) => (
            <div
              key={b.n}
              className="ball"
              style={{
                left: b.x,
                top: b.y,
              }}
              onClick={() => clickBall(b.n)}
            >
              {b.n}
            </div>
          ))}
      </div>

      {phase === 'done' && (
        <div className="result">
          결과 {((endRef.current - startRef.current) / 1000).toFixed(3)} 초
          <button className="re-btn" onClick={restart}>
            다시하기
          </button>
        </div>
      )}
    </div>
  );
}
