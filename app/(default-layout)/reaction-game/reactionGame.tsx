'use client';
import { useEffect, useRef, useState } from 'react';

type Phase = 'idle' | 'waiting' | 'ready' | 'result';

export default function ReactionGame() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [message, setMessage] = useState('Click START to begin!');
  const [reactionTime, setReactionTime] = useState<number | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const startGame = () => {
    clearTimer();
    setReactionTime(null);
    setPhase('waiting');
    setMessage('Wait for GREEN!');

    const randomDelay = Math.floor(Math.random() * 2000) + 1500;
    timeoutRef.current = setTimeout(() => {
      setPhase('ready');
      setMessage('ClICK!');
      startRef.current = performance.now();
      timeoutRef.current = null;
    }, randomDelay);
  };

  const handleAction = () => {
    if (phase === 'idle' || phase === 'result') {
      startGame();
      return;
    }

    if (phase === 'waiting') {
      clearTimer();
      startRef.current = null;
      setPhase('idle');
      setMessage('Too early! Wait for GREEN');
      return;
    }

    if (phase === 'ready' && startRef.current !== null) {
      const end = performance.now();
      const time = Math.round(end - startRef.current);
      setReactionTime(time);
      setMessage(`Your reaction time: ${time} ms`);
      setPhase('result');
      startRef.current = null;
      clearTimer();
    }
  };

  const isReady = phase === 'ready';
  const isWaiting = phase === 'waiting';
  const isPlaying = phase === 'waiting' || phase === 'ready';

  return (
    <div className="reaction-game-container">
      <h2 className="game-title">⚡ 반응속도 테스트 ⚡</h2>

      {/* 스크린 리더가 메시지 변화를 읽을 수 있게 */}
      <p className="message" aria-live="polite">
        {message}
      </p>

      <div className="game-screen">
        <button
          type="button"
          onClick={handleAction}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleAction();
            }
          }}
          className={`reaction-btn ${isReady ? 'green' : 'red'}`}
          disabled={false}
        >
          {isPlaying ? 'CLICK' : 'START'}
        </button>
      </div>

      {/* {reactionTime !== null && <p className="time">⏱ {reactionTime} ms</p>} */}
      <p className="time">⏱ {reactionTime !== null ? reactionTime : 0} ms</p>
    </div>
  );
}
