const { io } = require("..");
const { GameServer } = require("./game-server");

var players = {};

io.on("connection", socket => {
    io.emit("user-connection", { id: socket.id });
    GameServer.handleConnect(socket);

    socket.on("disconnect", () => {
        io.emit("user-disconnection", { id: socket.id });
        GameServer.handleDisconnect(socket);
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
        GameServer.handlePlayerMove(socket.id, event);
    })

});
