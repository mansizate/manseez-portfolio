export default function TicTacToe({ board, thinking, result, winningCells, score, onCellClick, onNewGame }) {
  const status = thinking
    ? "Mansi is thinking..."
    : result === "X" ? "You win!"
      : result === "O" ? "Mansi wins!"
        : result === "draw" ? "It's a draw!" : "Your turn";

  return (
    <div className="tic-tac-toe-content" aria-label="Tic-Tac-Toe game">
      <div className="tic-tac-toe-heading">
        <span className="eyebrow">SECOND GAME</span>
        <h1>Tic-Tac-Toe</h1>
        <p>Player: X <span aria-hidden="true">·</span> Mansi: O</p>
      </div>
      <div className="tic-tac-toe-status" aria-live="polite">{status}</div>
      <div className="tic-tac-toe-board" role="grid" aria-label="Tic-Tac-Toe board">
        {board.map((value, index) => (
          <button
            key={index}
            type="button"
            className={`tic-tac-toe-cell ${winningCells.includes(index) ? "winning" : ""}`}
            onClick={() => onCellClick(index)}
            disabled={Boolean(value) || thinking || Boolean(result)}
            aria-label={`Cell ${index + 1}${value ? `, ${value}` : ", empty"}`}
            role="gridcell"
          >
            {value}
          </button>
        ))}
      </div>
      <div className="tic-tac-toe-score" aria-label="Score">
        <div><strong>YOU</strong><span>{score.player}</span></div>
        <div><strong>MANSI</strong><span>{score.computer}</span></div>
        <div><strong>TIES</strong><span>{score.ties}</span></div>
      </div>
      
    </div>
  );
}
