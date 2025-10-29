import Link from 'next/link';
import GameInfo from './gameInfo';

type CardData = {
  id: number;
  gamecode: string;
  pathname: string;
};

export default function GameCard(props: CardData) {
  const { pathname } = props;
  return (
    <Link href={`/${pathname}`}>
      <figure className="game-card">
        <div className="game-summary">
          <span className="index" />
        </div>
        <GameInfo gamecode="test" />
      </figure>
    </Link>
  );
}
