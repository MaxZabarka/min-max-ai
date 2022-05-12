let gameState;

function getPossibleMoves(gameState, playerMove) {
  const possibleMoves = [];
  gameState.forEach((row, y) => {
    row.forEach((square, x) => {
      if (square === " ") {
        const possibleGameState = JSON.parse(JSON.stringify(gameState));
        possibleGameState[y][x] = playerMove;
        possibleMoves.push(possibleGameState);
      }
    });
  });
  return possibleMoves;
}

function printGameState(gameState) {
  console.log("-------");
  gameState.forEach((row) => {
    let buffer = "";
    row.forEach((square) => {
      buffer += "|" + square;
    });
    console.log(buffer + "|");
    console.log("-------");
  });
}

function getGameEnd(gameState) {
  for (y = 0; y < gameState.length; y++) {
    // test rows
    if (
      gameState[y][0] === gameState[y][1] &&
      gameState[y][1] === gameState[y][2]
    ) {
      return gameState[y][0];
    }

    // test columns
    if (
      gameState[0][y] === gameState[1][y] &&
      gameState[1][y] === gameState[2][y]
    ) {
      return gameState[0][y];
    }
  }

  // test diagonals
  if (
    (gameState[0][0] === gameState[1][1] &&
      gameState[1][1] === gameState[2][2]) ||
    (gameState[0][2] === gameState[1][1] && gameState[1][1] === gameState[2][0])
  ) {
    return gameState[1][1];
  }
  for (y = 0; y < gameState.length; y++) {
    for (x = 0; x < gameState.length; x++) {
      if (gameState[y][x] === " ") {
        return false;
      }
    }
  }
  return "tie";
}

function getOppositePlayer(player) {
  return player === "X" ? "O" : "X";
}

function getStateRating(gameState, playerMove) {
  const gameEnd = getGameEnd(gameState);
  if (gameEnd === "X") {
    return [null, Infinity];
  }
  if (gameEnd === "O") {
    return [null, -Infinity];
  }
  if (gameEnd === "tie") {
    return [null, 0];
  }
  let bestMove = null;
  let bestRating = null;
  getPossibleMoves(gameState, playerMove).forEach((possibleMove) => {
    const [_, rating] = getStateRating(
      possibleMove,
      getOppositePlayer(playerMove)
    );
    if (bestRating === null) {
      bestRating = rating;
      bestMove = possibleMove;
    }
    if (playerMove === "X") {
      if (rating > bestRating) {
        bestRating = rating;
        bestMove = possibleMove;
      }
    } else {
      if (rating < bestRating) {
        bestRating = rating;
        bestMove = possibleMove;
      }
    }
  });
  return [bestMove, bestRating];
}

function updateDom() {
  gameState.forEach((row, y) => {
    row.forEach((_, x) => {
      document.getElementById(y.toString() + x.toString()).innerText =
        gameState[y][x];
    });
  });
}

function init(player) {
  gameState = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ];

  if (player === "O") {
    gameState = getAiMove("X");
  }
  updateDom();
  gameState.forEach((row, y) => {
    row.forEach((_, x) => {
      document.getElementById(y.toString() + x.toString()).onclick = () => {
        console.log("HERE");
        const square = gameState[y][x];
        if (square === " ") {
          gameState[y][x] = player;
          updateDom();
          gameState = getAiMove(getOppositePlayer(player));
          updateDom();
        }
      };
    });
  });
}

function getAiMove(player) {
  const [move, _] = getStateRating(gameState, player);
  return move;
}

let player = "O";

init(player);

document.getElementById("O").onclick = () => {
  init("O");
};

document.getElementById("X").onclick = () => {
  init("X");
};
