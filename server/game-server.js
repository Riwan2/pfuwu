const { Socket } = require("socket.io");

class GameServer {
    static players = {};

    /*
        handle events
    */

    /**
     * 
     * @param {Socket} socket 
     */
    static handleConnect(socket)
    {
        this.players[socket.id] = {};
    }

    /**
     * 
     * @param {Socket} socket 
     */
    static handleDisconnect(socket)
    {
        delete this.players[socket.id];
    }

    /**
     * 
     * @param {Socket} socket 
     */
    static handlePlayerMove(socketId, matrix)
    {
        this.players[socketId].matrix = matrix;
    }

    /*
        update
    */

    static update()
    {
        io.emit("players-move", this.players);
    }
}

module.exports = { GameServer }
