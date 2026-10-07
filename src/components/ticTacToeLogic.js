const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export const getWinner = (board) => {
  const line = WINNING_LINES.find(([a, b, c]) => (
    board[a] && board[a] === board[b] && board[a] === board[c]
  ));
  return line ? { player: board[line[0]], line } : null;
};

export const chooseComputerMove = (board) => {
  const available = board.map((value, index) => (value ? null : index)).filter((index) => index !== null);
  const findWinningMove = (mark) => available.find((index) => {
    const candidate = [...board];
    candidate[index] = mark;
    return getWinner(candidate)?.player === mark;
  });

  const winningMove = findWinningMove("O");
  if (winningMove !== undefined) return winningMove;
  const blockingMove = findWinningMove("X");
  if (blockingMove !== undefined) return blockingMove;
  if (available.includes(4)) return 4;

  const corners = available.filter((index) => [0, 2, 6, 8].includes(index));
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
  return available[Math.floor(Math.random() * available.length)];
};
