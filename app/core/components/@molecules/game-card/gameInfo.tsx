type GameInfoProps = {
  gamecode: string;
};

export default function GameInfo(props: GameInfoProps) {
  return (
    <figcaption className="game-info">
      <div className="info"></div>
      <strong className="title">여기는 게임이름</strong>
    </figcaption>
  );
}
