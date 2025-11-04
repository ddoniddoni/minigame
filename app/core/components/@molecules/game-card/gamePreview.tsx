type GamePreviewProps = {
  gamecode: string;
};

export default function GamePreview(props: GamePreviewProps) {
  const { gamecode } = props;
  return (
    <section className="game-preview" data-gamecode={gamecode}>
      <h2 className="hidden">미리보기</h2>
    </section>
  );
}
