/*
    chat
*/

import { gameContainer } from "../main";
import { ChatNetwork } from "../network/chat-network";

const textInput = document.getElementById("message-text");
const messageList = document.getElementById("message-list");

class Chat {

    static msgSystem(content) 
    {
        const message = document.createElement('li');
        message.id = "msg-system";
        message.textContent = "▻ " + content;
        appendMessage(message);
    }

    static msgUser(name, content) 
    {
        const message = document.createElement('li');
        const nameDiv = document.createElement('div');
        const contentDiv = document.createElement('div');
        
        const start = document.createElement('span');
        start.textContent = "[";
        const end = document.createElement('span');
        end.textContent = "]:";

        message.id = "msg-user";
        nameDiv.textContent = name;
        nameDiv.id = "msg-name";
        contentDiv.textContent = content;
        contentDiv.id = "msg-content"

        message.appendChild(start);
        message.appendChild(nameDiv);
        message.appendChild(end);
        message.appendChild(contentDiv);
        
        appendMessage(message);
    }

    static focus()
    {
        textInput.focus();
    }

    static scrollDown()
    {
        messageList.scrollTop = messageList.scrollHeight;
    }
}

// add message to the chat window of client
function appendMessage(msg) 
{
    messageList.appendChild(msg);
    Chat.scrollDown();
}

function focusGame()
{
    textInput.blur();
    gameContainer.focus();
}

textInput.onkeydown = (event) => {
    const length = textInput.innerText.length;
    const isFull = length > 120;

    textInput.style.overflow = "hidden";

    if (event.code == "Tab") {
        focusGame();
        event.preventDefault();
    }

    if (event.key == 'Enter') {
        event.preventDefault();

        if (length <= 0) {
            focusGame();
            return;
        }

        ChatNetwork.send(textInput.textContent);
        textInput.textContent = "";
        return;
    }

    if (isFull) event.preventDefault();
};

export { Chat }
