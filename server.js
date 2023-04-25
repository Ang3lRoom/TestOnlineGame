const express = require('express');
const app = express();
const http = require('http').Server(app);
const sio = require('socket.io')(http);
const _ = require('underscore');
const io = require('socket.io')(http);

// Serve static files from the www directory
app.use(express.static(__dirname + '/www'));

// Define player sprites
const player1Sprite = { x: 0, y: 0 };
const player2Sprite = { x: 0, y: 0 };

http.listen(3000, ()=>{
    console.log('listening on http://192.168.100.4:3000');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  // Emit the initial positions of both players to the new client
  socket.emit('initial-positions', {
    player1: { x: player1Sprite.x, y: player1Sprite.y },
    player2: { x: player2Sprite.x, y: player2Sprite.y },
  });

  // Handle player 1 movement and emit updates to player 2
  socket.on('player1-moved', (player) => {
    player1Sprite.x = player.x;
    player1Sprite.y = player.y;
    socket.broadcast.emit('player1-moved', { x: player1Sprite.x, y: player1Sprite.y });
  });

  // Handle player 2 movement and emit updates to player 1
  socket.on('player2-moved', (player) => {
    player2Sprite.x = player.x;
    player2Sprite.y = player.y;
    socket.broadcast.emit('player2-moved', { x: player2Sprite.x, y: player2Sprite.y });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
