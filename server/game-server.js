const { Socket } = require("socket.io");
const { io } = require("..");

const eStressTest = "stress-test";

/*
    Event name
*/

const eUserConnect = "user-connect";
const eUserDisconnect = "user-disconnect";
const eChatMessage = "chat-message";
const ePlayersMove = "players-move"

/*
    Game server
*/

class GameServer {
    static players = {};

    /*
        handle events
    */

    static handleConnect(socketId)
    {
        this.players[socketId] = {};
    }

    static handleDisconnect(socketId)
    {
        delete this.players[socketId];
    }

    static handlePlayerMove(socketId, event)
    {
        this.players[socketId] = event;
    }

    /*
        update
    */

    static update()
    {
        io.emit(ePlayersMove, this.players);
    }
}

/* 
    handle events
*/

io.on("connection", socket => {

    io.emit(eUserConnect, { id: socket.id });
    GameServer.handleConnect(socket.id);

    // disconnect
    socket.on("disconnect", () => {
        io.emit(eUserDisconnect, { id: socket.id });
        GameServer.handleDisconnect(socket.id);
    })
    
    // chat message
    socket.on(eChatMessage, (msg) => {
        io.emit(eChatMessage, { id: socket.id, content: msg });
    })

    // debugging
    socket.on(eStressTest, (msg) => {
        io.emit(eStressTest);
    })

    // player pos
    socket.on(ePlayersMove, (event) => {
        GameServer.handlePlayerMove(socket.id, event);
    })

});

module.exports = { GameServer }
