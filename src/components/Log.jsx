export default function Log({ turns, NewChangedName }) {
  return (
    <div>
      <ol id="log">
        {Object.entries(NewChangedName)
          .filter(
            ([symbol, name]) =>
              (symbol === "X" && name !== "Player 1") ||
              (symbol === "O" && name !== "Player 2")
          )
          .map(([symbol, name]) => {
            const oldName = symbol === "X" ? "Player 1" : "Player 2";
            return (
              <li key={symbol}>
                {symbol}: {oldName} changed name to "<strong>{name}</strong>"
              </li>
            );
          })}
        {turns.map((turn) => (
          <li key={`${turn.square.row}${turn.square.col}`}>
            {turn.playerName} ({turn.player}) selected {turn.square.row},{" "}
            {turn.square.col}
          </li>
        ))}
      </ol>
    </div>
  );
}
