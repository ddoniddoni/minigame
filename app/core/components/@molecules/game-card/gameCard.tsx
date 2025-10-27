import GameInfo from './gameInfo';

export default function GameCard() {
  return (
    <>
      <figure className="game-card">
        <div className="game-summary">
          <span className="index" />
        </div>
        <GameInfo gamecode="test" />
      </figure>
    </>
  );
}
