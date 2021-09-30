import React, { useEffect, useRef } from 'react';
import { getDivOffset, screenDivCollision, useDraggable } from './use-draggable';

function DraggableBar({ parentRef, className,
    moveCallback, moveFinishedCallback }) 
{
    const barRef = useRef(null);
    var parentDiv;
    var offsetX, offsetY;
    var anchorDown, anchorRight;
    var anchorOffsetX, anchorOffsetY;

    useEffect(() => {
        parentDiv = parentRef.current;
        checkAnchor();
        window.addEventListener('resize', stayWindow);

        return () => {
            window.removeEventListener('resize', stayWindow);
        };
    }, [parentRef])

    // stay in the navigator window with 'smart' anchor
    // can resize the window
    const stayWindow = () => {
        const bottom = parentDiv.offsetTop + parentDiv.offsetHeight;
        const right = parentDiv.offsetLeft + parentDiv.offsetWidth;
        const newTop = window.innerHeight - parentDiv.offsetHeight;
        const newLeft = window.innerWidth - parentDiv.offsetWidth;

        // don't go plus window bottom
        if (bottom > window.innerHeight) parentDiv.style.top = newTop + 'px';
        else {
            if (anchorDown) parentDiv.style.top = newTop - anchorOffsetY + 'px';
            else parentDiv.style.top = anchorOffsetY + 'px';
        }
        // don't go minus window top
        if (parentDiv.offsetTop < 0) parentDiv.style.top = 0 + 'px';

        // don't go plus window right
        if (right > window.innerWidth) parentDiv.style.left = newLeft + 'px';
        else {
            if (anchorRight) parentDiv.style.left = newLeft - anchorOffsetX + 'px';
            else parentDiv.style.left = anchorOffsetX + 'px';
        }
        // don't go minus window left
        if (parentDiv.offsetLeft < 0) parentDiv.style.left = 0 + 'px';
    };

    // init the drag move
    const initMove = (e) => {
        [offsetX, offsetY] = getDivOffset(barRef, parentRef, e.pageX, e.pageY);
    };

    // move the parent div with the dragbar
    const move = (e) => {
        parentDiv.style.left = e.pageX - offsetX + 'px';
        parentDiv.style.top = e.pageY - offsetY + 'px';

        if (screenDivCollision(parentDiv))
            [offsetX, offsetY] = getDivOffset(barRef, parentRef, e.pageX, e.pageY);
        
        moveCallback?.();
    };

    const stopMove = (e) => {
        checkAnchor(e);
        moveFinishedCallback?.();
    }

    // smart anchor, try to say at user defined position
    const checkAnchor = (e) => {
        const top = parentDiv.offsetTop;
        const left = parentDiv.offsetLeft;
        const bottom = top + parentDiv.offsetHeight;
        const right = left + parentDiv.offsetWidth;
        
        // determine if the anchor will be applied from top or bottom window side
        // and calculate the anchor offset
        if (bottom - parentDiv.offsetHeight / 2 > window.innerHeight / 2) {
            anchorDown = true;
            anchorOffsetY = window.innerHeight - bottom;
        } else {
            anchorDown = false;
            anchorOffsetY = top;
        }

        // determine if the anchor will be applied from right or left window side
        // and calculate the anchor offset
        if (right - parentDiv.offsetWidth / 2 > window.innerWidth / 2) {
            anchorRight = true;
            anchorOffsetX = window.innerWidth - right;
        } else {
            anchorRight = false;
            anchorOffsetX = left;
        }
    };
    
    // draggable hooks
    useDraggable(barRef, initMove, move, stopMove);

    return (
        <div ref={barRef} className={className} />
    );
}

export { DraggableBar };
