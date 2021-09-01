
const path = require('path');
const express = require('express');

// express app creation
const app = express();
const http = require('http');

// http server creation
const httpServer = http.createServer(app);
const { Server } = require("socket.io");

// socket.io server initialisation
io = new Server(httpServer, {
    cors: {
        origin: "*"
    },
});

// deliver content to client
app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

// http server
const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
    console.log('listening on: *:', port);
});

// game server
const { GameServer } = require('./server/game-server.js');
const tickRate = 20;

setInterval(() => {
    GameServer.update();
}, tickRate);

module.exports = { io };

// handle io event and send them to game server
require("./server/handle-event.js");
