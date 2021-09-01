// client part
import { io } from "socket.io-client/dist/socket.io.js";
import { Object3D } from "three";
import { msgSystem, msgUser } from "../chat/chat";

var recoMaxTry = 2;
var recoTry = -1;

var socket;

// dev
if (window.location.port == "8080" && window.location.hostname == "localhost") {
    socket = io("http://localhost:3000", {
        reconnectionAttempts: recoMaxTry,
        autoConnect: false,
    });
} else {
    // build
    socket = io("", {
        reconnectionAttempts: recoMaxTry,
        autoConnect: false,
    });
}

function initConnection()
{
    msgSystem("connecting...");
    socket.connect();

    socket.on("connect_error", (err) => {
        recoTry++;
        console.log(err.message);
        if (err.message == "xhr poll error" && recoTry >= recoMaxTry)
            msgSystem("error: server unreachable");
    });
}

window.onload = function() {
    initConnection();
}

/*
    on connection
*/

socket.on("connect", () => {
    recoTry = 0;
});

socket.on("user-connection", (msg) => {
    msgSystem(msg.id + " connected");
});

/*
    on disconnection
*/

socket.on("disconnect", () => {

});

socket.on("user-disconnection", (msg) => {
    msgSystem(msg.id + " disconnected");
});

/*
    on chat message
*/

function sendChatMessage(content) 
{
    socket.emit("chat-message", content);
}

// socket.emit("chat-message", "hello");
socket.on("chat-message", (msg) => {
    msgUser(msg.id, msg.content);
});

/*
    send player pos
*/

/**
 * 
 * @param {Object3D} player 
 */

function sendPlayer(player) 
{
    socket.emit("player-move", { "matrix": player.matrixWorld });
}

var serverPlayers = [];

socket.on("players-move", (event) => {
    serverPlayers = [];

    for (const key in event) {
        if (key === socket.id) continue;
        const player = event[key];

        if (player.matrix)
            serverPlayers.push(player.matrix);
    }
});

export { sendChatMessage, sendPlayer, serverPlayers };
