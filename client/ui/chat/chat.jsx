import React, {useState, useEffect, useRef } from 'react';

import { DraggableBar } from '../panel-utils/draggable-bar';
import { TopLeftResizeButton } from '../panel-utils/topleft-resize-button';

import './chat.css'

// id="chat">
// <ul id="message-list"></ul>
// <div id="message-text-wrapper">
//     <div id="message-text" contenteditable="true"></div>
// </div>
// </div>

function Chat() {
    const chatDiv = useRef(null);

    return (
        <div ref={chatDiv} className="Chat">
            <DraggableBar parentRef={chatDiv} className="DraggableBar"/>
            <TopLeftResizeButton parentRef={chatDiv} className="TopLeftResizeButton"/>
        </div>
    );
}

export { Chat };
