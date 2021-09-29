import React, {useState, useEffect, useRef } from 'react';
import { InputManager } from 'input';
import { ChatNetwork } from 'game/network/chat-network';
import { focusGame } from 'client/main';

import { DraggableBar } from 'ui/panel-utils/draggable-bar';
import { TopLeftResizeButton } from 'ui/panel-utils/topleft-resize-button';

import './chat.css'

const Chat = {};

function InputField({className}) 
{
    const inputRef = useRef(null);
    var inputDiv;
    const maxLength = 55;
    var length = 0;

    useEffect(() => {
        inputDiv = inputRef.current;
        inputDiv.onclick = onFocus;
        inputDiv.oninput = onInput;
        inputDiv.onkeydown = onKeyDown;
    });

    const onFocus = () => {
        inputDiv.focus();
        InputManager.blockInputTag("player", true);
    };

    Chat.focus = () => {
        onFocus();
    }

    const quitInput = () => {
        inputDiv.blur();
        InputManager.blockInputTag("player", false);
        focusGame();            
    }

    const onInput = (e) => {
        length = inputDiv.innerText.length;
    };

    const onKeyDown = (e) => {
        const erase = e.key === 'Backspace';
        const ctrlMeta = e.ctrlKey || e.metaKey;

        // quit chat
        if (e.key === 'Tab' || e.key === 'Escape')
            quitInput();

        // confirm input, send message
        if (e.key === 'Enter') {
            // no text so quit chat
            if (length <= 0) {
                quitInput();
            } else {
                // send text to network
                ChatNetwork.send(inputDiv.textContent);
                inputDiv.textContent = "";
                length = 0;
            }
        }

        // max characters limits block input
        if (length > maxLength && !erase && !ctrlMeta)
            e.preventDefault();
    };

    return (
        <div ref={inputRef} contentEditable="true" className={className}></div>
    );
}

var messageID = 0;

function MessageUsr({msg})
{
    return (
        <div className="msg-user">
            <div className="name"> {"<" + msg.user + ">"} </div>
            <div> {msg.content} </div>
        </div>
    );
}

function MessageSystem({msg})
{
    return (
        <div className="msg-system">
            <span> ▻ </span>
            {msg.content}
        </div>
    );
}

function ChatMessageList({className})
{
    const [messages, setMessages] = useState([]);
    const divRef = useRef(null);
    const followMsgRef = useRef(true);
    const lastHeight = useRef(0);

    useEffect(() => {
        divRef.current.addEventListener('scroll', onScroll);
        return () => {
            divRef.current.removeEventListener('scroll', onScroll);
        }
    }, [divRef]);

    const checkFollowMessage = () => {
        const div = divRef.current;
        const offsetScroll = div.scrollHeight - div.offsetHeight;
        const messageHeight = div.lastChild.previousSibling.offsetHeight;
        if (offsetScroll - div.scrollTop <= messageHeight / 2) followMsgRef.current = true;
        else followMsgRef.current = false;
    }

    const onScroll = (e) => {
        checkFollowMessage();
    }

    const scrollDown = () => {
        if (followMsgRef.current) {
            divRef.current.scrollTop = divRef.current.scrollHeight;
        } else {
            
            // when resize, the middle messages are always focused
            if (lastHeight.current && lastHeight.current !== divRef.current.scrollHeight) {
                const ratio =  divRef.current.scrollHeight / lastHeight.current;
                const height = divRef.current.offsetHeight;
                const offset = (ratio - 1) * (height / 2);
                divRef.current.scrollTop += offset;
            }
            
            lastHeight.current = divRef.current.scrollHeight;
        }
    };

    Chat.scrollDown = scrollDown;

    const createMessage = (content) => {
        messageID++;
        return {
            id: `ides${messageID}`,
            content: content
        };
    };

    const addMessage = (msg) => {
        setMessages([...messages, msg]);
        scrollDown();
    };

    Chat.msgSystem = (content) => {
        const msg = {
            ...createMessage(content),
            type: 'system'
        };
        msg.div = <MessageSystem key={msg.id} msg={msg} />;
        addMessage(msg);
    };

    Chat.msgUser = (user, content) => {
        const msg = {
            ...createMessage(content),
            type: 'system',
            user: user
        };
        msg.div =  <MessageUsr key={msg.id} msg={msg} />;
        addMessage(msg);
    }

    const messageList = messages.map((msg) => {
        return msg.div;
    });
    return (
        <div ref={divRef} className={className}> {messageList} </div>
    );
}

function ChatComponent() 
{
    const chatRef = useRef(null);

    const onResize = () => {
        Chat.scrollDown();
    }

    return (
        <div ref={chatRef} className="Chat">
            <div className="TopBar">
                <DraggableBar parentRef={chatRef} className="DraggableBar" 
                    resizeCallback={onResize}/>
                <TopLeftResizeButton parentRef={chatRef} className="TopLeftResizeButton" 
                    resizeCallback={onResize}/>
            </div>

            <ChatMessageList className="message-list no-scrollbar" />
            <InputField className="input-field no-scrollbar" />
        </div>
    );
}

export { ChatComponent, Chat };
