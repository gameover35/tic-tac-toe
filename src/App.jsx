import { useState } from "react";
import React from "react";

import Player from "./components/Player";

import GameBoard from "./components/GameBoard.jsx";
import Log from "./components/Log.jsx";
import GameOver from "./components/GameOver.jsx";

import { WINNING_COMBINATIONS } from "./winning-combination.js";

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(thisTurns) {
  let currentPlayer = "X";

  if (thisTurns.length > 0 && thisTurns[0].player === "X") {
    currentPlayer = "O";
  }

  return currentPlayer;
}

function minimax(board, depth, isMaximizing, aiSymbol, humanSymbol, maxDepth = 3) {
  // Check for winner
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    const v1 = board[a.row][a.column];
    const v2 = board[b.row][b.column];
    const v3 = board[c.row][c.column];
    if (v1 && v1 === v2 && v1 === v3) {
      if (v1 === aiSymbol) return 10 - depth;
      if (v1 === humanSymbol) return depth - 10;
    }
  }

  // Check for draw
  if (board.flat().every((cell) => cell)) return 0;

  // Medium AI: stop searching after maxDepth
  if (depth >= maxDepth) {
    return 0; // treat as neutral outcome
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (!board[r][c]) {
          board[r][c] = aiSymbol;
          const score = minimax(board, depth + 1, false, aiSymbol, humanSymbol, maxDepth);
          board[r][c] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (!board[r][c]) {
          board[r][c] = humanSymbol;
          const score = minimax(board, depth + 1, true, aiSymbol, humanSymbol, maxDepth);
          board[r][c] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}


function getBestMove(board, aiSymbol, humanSymbol) {
  let bestScore = -Infinity;
  let move = null;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (!board[r][c]) {
        board[r][c] = aiSymbol;
        const score = minimax(board, 0, false, aiSymbol, humanSymbol);
        board[r][c] = null;
        if (score > bestScore) {
          bestScore = score;
          move = { row: r, col: c };
        }
      }
    }
  }
  return move;
}

function App() {
  const [Players, setPlayers] = useState({
    X: "Player 1",
    O: "AI", // Set Player 2 as AI
  });

  const [gameTurns, setGameTurns] = useState([]);
  // const [activePlayer, setActivePlayer] = useState("X");

  let gameBoard = [...initialGameBoard.map((array) => [...array])];
  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;
    gameBoard[row][col] = player;
  }

  let winner;
  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol =
      gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol =
      gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol =
      gameBoard[combination[2].row][combination[2].column];
    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = Players[firstSquareSymbol];
    }
  }

  const hasDraw = gameTurns.length === 9 && !winner;
  const activePlayer = deriveActivePlayer(gameTurns);

  // --- AI Move Effect ---
  // Only triggers if it's AI's turn and game is not over
  React.useEffect(() => {
    if (
      Players[activePlayer] === "AI" &&
      !winner &&
      !hasDraw
    ) {
      const aiMove = getBestMove(gameBoard, activePlayer, activePlayer === "X" ? "O" : "X");
      if (aiMove) {
        setTimeout(() => {
          selectHandleSquare(aiMove.row, aiMove.col);
        }, 500); // Delay for realism
      }
    }
    // eslint-disable-next-line
  }, [activePlayer, winner, hasDraw, gameBoard]);

  function selectHandleSquare(rowIndex, columnIndex) {
    if (gameBoard[rowIndex][columnIndex] || winner || hasDraw) return;
    setGameTurns((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns);
      const currentPlayerName = Players[currentPlayer];
      const updatedTurns = [
        {
          square: { row: rowIndex, col: columnIndex },
          player: currentPlayer,
          playerName: currentPlayerName,
        },
        ...prevTurns,
      ];
      return updatedTurns;
    });
  }

  function resetGame() {
    setGameTurns([]);
    setPlayers(Players);
  }

  function nameChangeHandler(symbol, newName) {
    setPlayers((prevPlayers) => {
      return {
        ...prevPlayers,
        [symbol]: newName,
      };
    });
    return Players;
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName="Player 1"
            symbol="X"
            isActive={activePlayer === "X"}
            onChangedName={nameChangeHandler}
          />
          <Player
            initialName="AI"
            symbol="O"
            isActive={activePlayer === "O"}
            onChangedName={nameChangeHandler}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} onReset={resetGame} />
        )}
        <GameBoard onSelectSquare={selectHandleSquare} board={gameBoard} />
      </div>
      <Log turns={gameTurns} NewChangedName={Players} />
    </main>
  );
}

export default App;
