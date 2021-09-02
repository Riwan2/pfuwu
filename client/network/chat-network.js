import { Chat } from "../chat/chat";
import { socket } from "./client";

const eChatMessage = "chat-message";

class ChatNetwork {
    static send(content) 
    {
        socket.emit(eChatMessage, content);
    }
}

// listen to event
socket.on(eChatMessage, (msg) => {
    Chat.msgUser(msg.id, msg.content);
});

export { ChatNetwork };
