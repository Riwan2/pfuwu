import React, {useState, useEffect, useRef } from 'react';
import { InputManager } from '../../game/input/input';
import { ChatNetwork } from '../../game/network/chat-network';
import { focusGame } from '../../main';

import { DraggableBar } from '../panel-utils/draggable-bar';
import { TopLeftResizeButton } from '../panel-utils/topleft-resize-button';

import './chat.css'

// id="chat">
// <ul id="message-list"></ul>
// <div id="message-text-wrapper">
//     <div id="message-text" contenteditable="true"></div>
// </div>
// </div>

var InputField = function({className}) 
{
    const inputRef = useRef(null);
    var inputDiv;
    const maxLength = 55;
    var length = 0;

    useEffect(() => {
        inputDiv = inputRef.current;
        inputDiv.addEventListener('click', onFocus);
        inputDiv.addEventListener('input', onInput);
        inputDiv.addEventListener('keydown', onKeyDown);
    });

    const onFocus = () => {
        inputDiv.focus();
        InputManager.blockInputTag("player", true);
    };

    // gros porc
    window.focusChat = () => {
        onFocus();
    }

    const quitInput = () => {
        inputDiv.blur();
        focusGame();
        InputManager.blockInputTag("player", false);
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
                console.log(inputDiv.textContent);
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

function Chat() 
{
    const chatDiv = useRef(null);

    return (
        <div ref={chatDiv} className="Chat">

            <div className="TopBar">
                <DraggableBar parentRef={chatDiv} className="DraggableBar" />
                <TopLeftResizeButton parentRef={chatDiv} className="TopLeftResizeButton"/>
            </div>

            <div className="MessagePanel"></div>
            <InputField className="InputField" />
        </div>
    );
}

export { Chat };
