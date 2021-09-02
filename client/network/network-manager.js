import { Chat } from "../chat/chat";
import { Player } from "../player/player";
import { socket } from "./client";

/*
    Event name
*/

const eUserConnect = "user-connect";
const eUserDisconnect = "user-disconnect";
const ePlayersMove = "players-move"

class NetworkManager {
    static players = [];

    /**
     * 
     * @param {Player} player 
     */
    static sendPlayerInfo(player) 
    {
        socket.emit(ePlayersMove, { "matrix": player.matrixWorld });
    }

    static handlePlayerInfo(playerInfo)
    {
        this.players.push(playerInfo);
    }
}

// handle other players connection
socket.on(eUserConnect, (event) => {
    Chat.msgSystem(event.id + " connected");
});

// handle other players disconnection
socket.on(eUserDisconnect, (event) => {
    Chat.msgSystem(event.id + " disconnected");
});

// handle other players info
socket.on(ePlayersMove, (event) => {
    NetworkManager.players = [];

     for (const key in event) {
         if (key === socket.id) continue;
         const playerInfo = event[key];
         NetworkManager.handlePlayerInfo(playerInfo);
     }
 });

export { NetworkManager }
