import React, { useRef } from 'react';
import { getDivOffset, screenDivCollision, useDraggable } from './use-draggable';

function DraggableBar(props) 
{
    const barRef = useRef(null);
    const parentRef = props.parentRef;
    var offsetX, offsetY;

    const initMove = (e) => {
        [offsetX, offsetY] = getDivOffset(barRef, parentRef, e.pageX, e.pageY);
    };

    const move = (e) => {
        const parentDiv = parentRef.current;
        parentDiv.style.left = e.pageX - offsetX + 'px';
        parentDiv.style.top = e.pageY - offsetY + 'px';

        if (screenDivCollision(parentDiv))
            [offsetX, offsetY] = getDivOffset(barRef, parentRef, e.pageX, e.pageY);
    };
    
    // draggable hooks
    useDraggable(barRef, initMove, move);

    return (
        <div ref={barRef} className={props.className}></div>
    );
}

export { DraggableBar };
