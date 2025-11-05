import BrickGame from './brickGame';

export default function BrickGamePage() {
  return (
    <>
      <main className="layout-pages page-brick-game">
        <h1 className="hidden">블록 게임</h1>
        <BrickGame />
      </main>
    </>
  );
}
