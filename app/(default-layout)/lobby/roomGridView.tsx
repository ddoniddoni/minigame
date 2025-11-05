'use client';
import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import GameCard from '@ui/@molecules/game-card/gameCard';
import { GameCode } from '@ui/types';

type Game = {
  id: number;
  gamecode: GameCode;
  pathname: string;
};

export default function RoomGridView() {
  const [games, setGames] = useState<Game[]>([]);
  useEffect(() => {
    setGames([
      {
        id: 1,
        gamecode: 'reaction',
        pathname: 'reaction-game',
      },
      {
        id: 2,
        gamecode: 'aimtest',
        pathname: 'aimtest',
      },
      {
        id: 3,
        gamecode: 'brickgame',
        pathname: 'brick-game',
      },
    ]);
  }, []);
  return (
    <AnimatePresence>
      <motion.ul className={`list-games`} data-room-view={'grid'}>
        {games.length > 0 ? (
          <>
            {games.map((item, index) => {
              const { id, gamecode, pathname } = item;
              return (
                <motion.li
                  key={`${gamecode}:${index}`}
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.03,
                  }}
                >
                  <GameCard gamecode={gamecode} id={id} pathname={pathname} />
                </motion.li>
              );
            })}
          </>
        ) : (
          <li className="none">방 없음</li>
        )}
      </motion.ul>
    </AnimatePresence>
  );
}
