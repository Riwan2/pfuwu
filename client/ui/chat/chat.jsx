import React, { useEffect, useRef } from 'react';
import { DraggableBar } from 'ui/panel-utils/draggable-bar';
import { TopLeftResizeButton } from 'ui/panel-utils/topleft-resize-button';

import { ChatInputField } from './chat-input';
import { ChatMessageList } from './chat-messages';

import './chat.css'

const Chat = {};

function ChatComponent()
{
    const chatRef = useRef(null);
    var chatDiv;

    useEffect(() => {
        chatDiv = chatRef.current;
    }, [chatRef])

    const onResize = () => {
        Chat.scrollDown();
    }

    const onResizeFinished = () => {
        const percentWidth = (chatDiv.offsetWidth / window.innerWidth).toFixed(2);
        const percentHeight = (chatDiv.offsetHeight / window.innerHeight).toFixed(2);
    }

    const onMoveFinished = () => {
        const percentX = (chatDiv.offsetLeft / window.innerWidth).toFixed(2);;
        const percentY = (chatDiv.offsetTop / window.innerHeight).toFixed(2);;
    }

    return (
        <div ref={chatRef} className="Chat">
            <div className="TopBar">
                <DraggableBar parentRef={chatRef} className="DraggableBar" 
                    moveFinishedCallback={onMoveFinished}/>
                <TopLeftResizeButton parentRef={chatRef} className="TopLeftResizeButton" 
                    resizeCallback={onResize} resizeFinishedCallback={onResizeFinished}/>
            </div>

            <ChatMessageList className="message-list no-scrollbar" />
            <ChatInputField className="input-field no-scrollbar" />
        </div>
    );
}

export { ChatComponent, Chat };
