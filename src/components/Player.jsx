import { useState } from "react";

export default function Player({
  initialName,
  symbol,
  isActive,
  onChangedName,
  winnerSymbol,
}) {
  const [playerName, setPlayerName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);

  function buttonClicked() {
    setIsEditing((editing) => !editing);

    if (isEditing) {
      onChangedName(symbol, playerName);
      //console.log(playerName);
    }
  }

  function handleChange(event) {
    setPlayerName(event.target.value);
  }


  return (
    <li className={isActive ? "active" : undefined}>
      <span className="player">
        {isEditing == false ? (
          <span className="player-name">{playerName}</span>
        ) : (
          <input value={playerName} onChange={handleChange} />
        )}

        <span className="player-symbol">{symbol}</span>
      </span>
      <button onClick={() => {
        buttonClicked();
      }}>{isEditing ? "save" : "edit"}</button>
    </li>
  );
}

