// Gorbagana Gambit: Lucky Ladders - Realtime Game Server (Socket.IO)
// This is a minimal multiplayer server for development and testnet.

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 4000;

// In-memory game state (for dev/test)
const games = {};

function generateSafeDoors() {
  const doors = {};
  for (let level = 1; level <= 10; level++) {
    doors[level] = Math.floor(Math.random() * 3);
  }
  return doors;
}

io.on('connection', (socket) => {
  // Join lobby
  socket.on('join_lobby', ({ gameId, player }) => {
    socket.join(gameId);
    if (!games[gameId]) {
      games[gameId] = {
        id: gameId,
        players: [],
        status: 'waiting',
        currentLevel: 1,
        pot: 3,
        safeDoors: generateSafeDoors(),
        createdAt: Date.now(),
      };
    }
    // Add player if not present
    if (!games[gameId].players.find(p => p.id === player.id)) {
      games[gameId].players.push({ ...player, position: 1, status: 'active', bribes: 0 });
    }
    io.to(gameId).emit('lobby_update', games[gameId]);
    // Start game if 3 players
    if (games[gameId].players.length === 3) {
      setTimeout(() => {
        games[gameId].status = 'playing';
        io.to(gameId).emit('game_start', games[gameId]);
      }, 2000);
    }
  });

  // Door selection
  socket.on('select_door', ({ gameId, playerId, level, doorIndex }) => {
    const game = games[gameId];
    if (!game) return;
    const safeDoor = game.safeDoors[level];
    const player = game.players.find(p => p.id === playerId);
    if (!player || player.position !== level || player.status !== 'active') return;
    if (doorIndex === safeDoor) {
      player.position = level + 1;
      if (level + 1 > 10) {
        player.status = 'winner';
        game.status = 'finished';
      }
    } else {
      player.status = 'eliminated';
      // If all eliminated, end game
      if (game.players.every(p => p.status !== 'active')) {
        game.status = 'finished';
      }
    }
    io.to(gameId).emit('game_update', game);
  });

  // Bribe
  socket.on('use_bribe', ({ gameId, playerId, level }) => {
    const game = games[gameId];
    if (!game) return;
    const player = game.players.find(p => p.id === playerId);
    if (!player || player.gorbaBalance < 1) return;
    player.gorbaBalance -= 1;
    player.bribes = (player.bribes || 0) + 1;
    // (In real contract, bribe would affect RNG)
    io.to(gameId).emit('game_update', game);
  });

  // Chat
  socket.on('send_message', ({ gameId, player, message }) => {
    io.to(gameId).emit('chat_message', { player, message, ts: Date.now() });
  });

  // Leave
  socket.on('leave_game', ({ gameId, playerId }) => {
    const game = games[gameId];
    if (!game) return;
    game.players = game.players.filter(p => p.id !== playerId);
    io.to(gameId).emit('lobby_update', game);
  });
});

app.get('/', (req, res) => {
  res.send('Gorbagana Gambit Game Server Running');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
