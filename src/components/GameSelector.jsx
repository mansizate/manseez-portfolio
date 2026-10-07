const games = [
  { id: "chess", icon: "♟", name: "Chess", description: "Play against Mansi" },
  { id: "tic-tac-toe", icon: "✕◯", name: "Tic-Tac-Toe", description: "Play against Mansi" },
];

export default function GameSelector({ selectedGame, onGameChange }) {
  return (
    <div className="game-selector">
      <div className="sidebar-section-title">GAME</div>
      <div className="game-options" role="tablist" aria-label="Choose a game">
        {games.map((game) => (
          <button
            key={game.id}
            type="button"
            className={`game-option ${selectedGame === game.id ? "active" : ""}`}
            onClick={() => onGameChange(game.id)}
            role="tab"
            aria-selected={selectedGame === game.id}
          >
            <span className="game-option-icon" aria-hidden="true">{game.icon}</span>
            <span className="game-option-copy">
              <strong>{game.name}</strong>
              <span>{game.description}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
