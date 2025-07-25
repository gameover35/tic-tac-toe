export default function GameBoard({ onSelectSquare, board }) {
  return (
    <div>
    <ol id="game-board">
      {board.map((row, rowIndex) => (
        <li key={rowIndex}>
          <ol>
            {row.map((playerSymbol, columnIndex) => (
              <li key={columnIndex}>
                <button
                  onClick={() => onSelectSquare(rowIndex, columnIndex)}
                  disabled={playerSymbol != null}
                >
                  {playerSymbol}
                </button>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
    <h4>Practice Project by <a href="https://github.com/gameover35/tic-tac-toe">Saad Sarfraz</a></h4>
    </div>
  );
}
