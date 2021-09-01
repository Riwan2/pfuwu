/*
    chat
*/

import { sendChatMessage } from "../client/client";
import { containerFocus } from "../game/main";

const textInput = document.getElementById("message-text");
const messageList = document.getElementById("message-list");

// create message for logging 
function msgSystem(pContent)
{
    var message = document.createElement('li');

    message.id = "msg-system";
    message.textContent = "▻ " + pContent;

    appendMessage(message);
}

// create message with content and pseudo at the begining
function msgUser(pName, pContent) 
{
    var message = document.createElement('li');
    var name = document.createElement('div');
    var content = document.createElement('div');
    
    var start = document.createElement('span');
    start.textContent = "[";
    var end = document.createElement('span');
    end.textContent = "]:";

    message.id = "msg-user";
    name.textContent = pName;
    name.id = "msg-name";
    content.textContent = pContent;
    content.id = "msg-content"

    message.appendChild(start);
    message.appendChild(name);
    message.appendChild(end);
    message.appendChild(content);
    
    appendMessage(message);
}

// add message to the chat window of client
function appendMessage(msg) 
{
    messageList.appendChild(msg);
    scrollDown();
}

function scrollDown()
{
    messageList.scrollTop = messageList.scrollHeight;
}

function chatFocus(event)
{
    textInput.focus();
    event.preventDefault();
}

textInput.onkeypress = (event) => {
    const length = textInput.innerText.length;
    const isFull = length > 120;

    textInput.style.overflow = "hidden";

    if (event.key == 'Enter') {
        event.preventDefault();

        if (length <= 0) {
            textInput.blur();
            containerFocus();
            return;
        }

        sendChatMessage(textInput.textContent);
        textInput.textContent = "";
        chatFocus(event);
        return;
    }

    if (isFull) event.preventDefault();
};

export { msgUser, msgSystem, scrollDown, chatFocus }
