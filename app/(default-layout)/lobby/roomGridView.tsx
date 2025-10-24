'use client';
import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import GameCard from '@ui/@molecules/game-card/gameCard';

type Room = {
  key: number;
  gamecode: string;
};

export default function RoomGridView() {
  const [rooms, setRooms] = useState<Room[]>([]);
  useEffect(() => {
    setRooms([
      {
        key: 0,
        gamecode: 'reaction',
      },
      {
        key: 1,
        gamecode: 'reaction2',
      },
    ]);
  }, []);
  return (
    <AnimatePresence>
      <motion.ul className={`list-rooms grid`} data-room-view={'grid'}>
        {rooms.length > 0 ? (
          <>
            {rooms.map((item, index) => {
              const { key, gamecode } = item;
              return (
                <motion.li
                  key={`${gamecode}:${index}`}
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.03,
                  }}
                >
                  <GameCard />
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
