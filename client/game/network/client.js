// client part
import { io } from "socket.io-client/dist/socket.io.js";
import { Object3D } from "three";
import { Chat } from "../chat/chat";

var recoMaxTry = 2;
var recoTry = -1;

var url = ""
if (window.location.port == "8080" && window.location.hostname == "localhost") {
    url = "http://localhost:3000";
}

// socket connection
const socket = io(url, {
    reconnectionAttempts: recoMaxTry,
    autoConnect: false,
});

// init connection
window.onload = function() {
    Chat.msgSystem("connecting...");
    socket.connect();

    // reconnection handling
    socket.on("connect_error", (err) => {
        recoTry++;
        console.log(err.message);
        if (err.message == "xhr poll error" && recoTry >= recoMaxTry)
            Chat.msgSystem("error: server unreachable");
    });
}

/*
    on connection
*/

socket.on("connect", () => {
    recoTry = 0;
});

/*
    on disconnection
*/

socket.on("disconnect", () => {

});

export { socket };
