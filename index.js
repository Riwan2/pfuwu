
const path = require('path');
const express = require('express');

const app = express();
const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const { Object3D } = require('three');
const io = new Server(server, {
    cors: {
        origin: "*"
    },
});

app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('listening on: *:', port);
});

/* node server */

var players = {};

io.on("connection", socket => {
    io.emit("user-connection", { id: socket.id });

    const object = new Object3D();
    console.log(object);

    socket.on("disconnect", () => {
        io.emit("user-disconnection", { id: socket.id });
        delete players[socket.id];
    })
    
    // message
    socket.on("chat-message", (msg) => {
        io.emit("chat-message", { id: socket.id, content: msg });
    })

    socket.on("client to server event", (msg) => {
        io.emit("server to client event");
    })

    // player pos
    socket.on("player-move", (event) => {
        players[socket.id] = event;
    })

});

function update()
{
    io.emit("players-move", players);
}

setInterval(() => {
    update();
}, 20);
