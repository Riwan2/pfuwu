import { Euler, Vector3 } from "three";
import { Chat } from "../chat/chat";
import { Player } from "../player/player";
import { socket } from "./client";

/*
    Event name
*/

const eUserConnect = "user-connect";
const eUserDisconnect = "user-disconnect";
const ePlayersInfo = "players-info";

// If no player info is received for the player
const playerDummy = { 
    "position": new Vector3(0, 0, 0), 
    "rotation": new Euler(0, 0, 0),
    "isMoving": false,
    "isRunning": false,
};

class NetworkManager {
    static players = [];

    /**
     * 
     * @param {Player} player 
     */
    static sendPlayerInfo(player) 
    {
        socket.emit(ePlayersInfo, { 
            "position": player.position, 
            "rotation": player.rotation, 
            "isMoving": player.isMoving,
            "isRunning": player.isRunning,
        });

    }

    static handlePlayerInfo(playerInfo)
    {
        if (!playerInfo.position || !playerInfo.rotation)
            playerInfo = playerDummy;
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
socket.on(ePlayersInfo, (data) => {
    NetworkManager.players = [];

    for (const key in data) {
        if (key === socket.id) continue;
        const playerData = data[key];
        NetworkManager.handlePlayerInfo(playerData);
    }
});

export { NetworkManager }
