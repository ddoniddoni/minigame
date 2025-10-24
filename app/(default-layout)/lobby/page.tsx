import GameList from './gameList';

export default function LobbyPage() {
  return (
    <div className="page-inner-contents page-game-list">
      <header>
        <div className="title">
          <h1 className="lobby-title">게임 타이틀</h1>
        </div>
      </header>
      <GameList />
    </div>
  );
}
