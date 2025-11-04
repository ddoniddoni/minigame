import { GameCode, games } from '../../types';

type GameInfoProps = {
  gamecode: GameCode;
};

export default function GameInfo(props: GameInfoProps) {
  const { gamecode } = props;

  return (
    <figcaption className="game-info">
      <div className="info"></div>
      <strong className="title">{games[gamecode]}</strong>
    </figcaption>
  );
}
