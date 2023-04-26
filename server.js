const express = require('express');
const app = express();
const http = require('http').Server(app);
const sio = require('socket.io')(http);
const _ = require('underscore');
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/www', {
  maxAge: '1d',
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'public, max-age=86400');
  },
}));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// Define player sprites
const player1Sprite = { x: 0, y: 0 };
const player2Sprite = { x: -200, y: 0 };

http.listen(3000, ()=>{
    console.log('listening on http://127.0.0.1:3000');
});

let numConnectedClients = 0;

io.on('connection', (socket) => {
  console.log('a user connected');
  numConnectedClients++;

  if (numConnectedClients === 1) {
    // First client to connect is player 1
    socket.emit('player-number', 1);
  } else if (numConnectedClients === 2) {
    // Second client to connect is player 2
    socket.emit('player-number', 2);
  } else {
    // More than two clients connected - reject this connection
    socket.emit('too-many-players');
    socket.disconnect();
    return;
  }

  socket.on('position-update', (positions) => {
    player1Sprite.x = positions.player1.x;
    player1Sprite.y = positions.player1.y;
    player2Sprite.x = positions.player2.x;
    player2Sprite.y = positions.player2.y;

    // Broadcast the updated positions to all connected clients
    io.emit('position-update', {
      player1: { x: player1Sprite.x, y: player1Sprite.y },
      player2: { x: player2Sprite.x, y: player2Sprite.y },
    });
  });

  // Emit the initial positions of both players to the new client
  socket.emit('initial-positions', {
    player1: { x: player1Sprite.x, y: player1Sprite.y },
    player2: { x: player2Sprite.x, y: player2Sprite.y },
  });

  // Handle player 1 movement and emit updates to player 2
  socket.on('player1-moved', (player) => {
    player2Sprite.x = player.x;
    player2Sprite.y = player.y;
    console.log('Player 2 moved to', player2Sprite.x, player2Sprite.y);
    socket.broadcast.emit('player2-moved', { x: player2Sprite.x, y: player2Sprite.y });
  });

  // Handle player 2 movement and emit updates to player 1
  socket.on('player2-moved', (player) => {
    player1Sprite.x = player.x;
    player1Sprite.y = player.y;
    console.log('Player 1 moved to', player1Sprite.x, player1Sprite.y);
    socket.broadcast.emit('player1-moved', { x: player1Sprite.x, y: player1Sprite.y });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
