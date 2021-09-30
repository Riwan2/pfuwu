import { InputManager } from 'input';
import { ChatNetwork } from 'game/network/chat-network';
import { focusGame } from 'client/main';

import React, { useEffect, useRef } from 'react';
import { Chat } from './chat'

const maxLength = 55;

function ChatInputField({className})
{
    const inputRef = useRef(null);
    var inputDiv;
    var length = 0;

    useEffect(() => {
        inputDiv = inputRef.current;
        inputDiv.addEventListener('click', onFocus);
        inputDiv.addEventListener('input', onInput);
        inputDiv.addEventListener('keydown', onKeyDown);
        
        return () => {
            inputDiv.removeEventListener('click', onFocus);
            inputDiv.removeEventListener('input', onInput);
            inputDiv.removeEventListener('keydown', onKeyDown);
        }
    }, [inputRef]);

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

export { ChatInputField };
