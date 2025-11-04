import Link from 'next/link';

import GameInfo from './gameInfo';
import GamePreview from './gamePreview';
import { GameCode } from '../../types';

type CardData = {
  id: number;
  gamecode: GameCode;
  pathname: string;
};

export default function GameCard(props: CardData) {
  const { pathname, id, gamecode } = props;
  return (
    <Link href={`/${pathname}`}>
      <figure className="game-card">
        <div className="game-summary" data-gamecode={gamecode}>
          <span className="index"># {id}</span>
        </div>
        <GamePreview gamecode={gamecode} />
        <GameInfo gamecode={gamecode} />
      </figure>
    </Link>
  );
}
