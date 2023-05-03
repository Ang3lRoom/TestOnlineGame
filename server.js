const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/www', {
  maxAge: '1d',
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'public, max-age=86400');
  },
}));

const PORT = process.env.PORT || 3000;

// Keep track of the players and their moves
let players = {};
let moves = Array(9).fill(null);

// Listen for incoming connections from clients
io.on('connection', (socket) => {
  console.log(`A user connected with socket id: ${socket.id}`);

  // Add the player to the game and send their player number
  if (Object.keys(players).length < 2) {
    let playerNumber = Object.keys(players).length + 1;
    players[socket.id] = playerNumber;
    socket.emit('player-number', playerNumber);
  }

  // Listen for move events from the clients
  socket.on('move', (data) => {
    let player = data.player;
    let cellIndex = data.cell;

    // Update the moves array with the move
    moves[cellIndex] = player;

    // Emit the move event to the other player
    socket.broadcast.emit('move', data);

    // Check for win conditions
    let win = checkWin(player);
    if (win) {
      console.log(`Player ${player} wins!`);
      // Reset the moves array
      moves = Array(9).fill(null);
      // Emit the win event to both players
      io.emit('win', player);
      win = false;
    } else if (moves.filter(m => m === null).length === 0) {
      console.log('Draw!');
      // Reset the moves array
      moves = Array(9).fill(null);
      // Emit the draw event to both players
      io.emit('draw');
      win = false;
    }
  });

 // Create an object to store the game points earned by each player
 let playerGamePoints = {
  1: 0,
  2: 0
};

// Listen for game point update message from the clients
socket.on('update-game-points', (data) => {
  let player = data.player;
  let points = data.points;
  
  if (player === 1) {
    playerGamePoints[1] += 1;
    console.log("player 1 points" + playerGamePoints[1]);
    socket.emit('game-points-updated', { player: 1, points: playerGamePoints[1] });
  } else {
    playerGamePoints[2] += 1;
    socket.emit('game-points-updated', { player: 2, points: playerGamePoints[2] });
    console.log("player 2 points" + playerGamePoints[2]);
  }
});


// Listen for disconnect events and remove the player from the game
socket.on('disconnect', () => {
  console.log(`User with socket id: ${socket.id} disconnected`);
  delete players[socket.id];
});

});

// Check for win conditions
function checkWin(player) {
  // Check rows
  for (let i = 0; i < 9; i += 3) {
    if (moves[i] === player && moves[i + 1] === player && moves[i + 2] === player) {
      return true;
    }
  }
  // Check columns
  for (let i = 0; i < 3; i++) {
    if (moves[i] === player && moves[i + 3] === player && moves[i + 6] === player) {
      return true;
    }
  }
  // Check diagonals
  if (moves[0] === player && moves[4] === player && moves[8] === player) {
    return true;
  }
  if (moves[2] === player && moves[4] === player && moves[6] === player) {
    return true;
  }
  return false;
}

// Start the server
http.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
