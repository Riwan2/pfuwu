const eStressTest = "stress-test";

/*
    Event name
*/

const eUserConnect = "user-connect";
const eUserDisconnect = "user-disconnect";
const eChatMessage = "chat-message";
const ePlayersInfo = "players-info";

import * as shared from "../shared/test.js";
shared.hello();
// shared.hello();

/*
    Game server
*/

class GameServer {
    players = {};

    constructor(io)
    {
        this.io = io;
        this.io.on("connection", (socket) => {
            wrapIo(io, socket, this);
        });
    }

    /*
        handle events
    */

    handleConnect(socketId)
    {
        this.players[socketId] = {};
    }

    handleDisconnect(socketId)
    {
        delete this.players[socketId];
    }

    handlePlayerInfo(socketId, data)
    {
        this.players[socketId] = data;
    }

    /*
        update
    */

    update()
    {
        this.io.emit(ePlayersInfo, this.players);
    }
}

/* 
    handle events
*/

function wrapIo(io, socket, server) {

    io.emit(eUserConnect, { id: socket.id });
    server.handleConnect(socket.id);

    // disconnect
    socket.on("disconnect", () => {
        io.emit(eUserDisconnect, { id: socket.id });
        server.handleDisconnect(socket.id);
    })
    
    // chat message
    socket.on(eChatMessage, (msg) => {
        io.emit(eChatMessage, { id: socket.id, content: msg });
    })

    // debugging
    socket.on(eStressTest, (msg) => {
        io.emit(eStressTest);
    })

    // player info
    socket.on(ePlayersInfo, (data) => {
        server.handlePlayerInfo(socket.id, data);
    });

}

export { GameServer };
