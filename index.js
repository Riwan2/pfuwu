import path from 'path';
import express from 'express';

// express app creation
const app = express();
import http from 'http';

// http server creation
const httpServer = http.createServer(app);
import { Server } from "socket.io";

// socket.io server initialisation
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    },
});

// __dirname
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
import { GameServer } from "./server/game-server.js";
const tickRate = 20;
const gameServer = new GameServer(io);

setInterval(() => {
    gameServer.update();
}, tickRate);
