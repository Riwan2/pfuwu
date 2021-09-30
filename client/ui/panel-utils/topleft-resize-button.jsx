import React, { useRef } from 'react';
import { getDivOffset, useDraggable } from './use-draggable';

function TopLeftResizeButton({ parentRef = null, className = "", 
    resizeCallback, resizeFinishedCallback,
    minWidth = 10, minHeight = 10, maxWidth = 1000, maxHeight = 10000 }) 
{
    const buttonRef = useRef(null);

    var offsetX, offsetY;
    var lastTop, lastHeight, lastLeft;

    const initMove = (e) => {
        const parentDiv = parentRef.current;
        [offsetX, offsetY] = getDivOffset(buttonRef, parentRef, e.pageX, e.pageY);
        
        lastTop = parentDiv.offsetTop;
        lastHeight = parentDiv.offsetHeight;
        lastLeft = parentDiv.offsetLeft;

        const minw = getSizeStyle(parentDiv, 'min-width');
        const minh = getSizeStyle(parentDiv, 'min-height');
        const maxw = getSizeStyle(parentDiv, 'max-width');
        const maxh = getSizeStyle(parentDiv, 'max-height');

        if (minw > 0) minWidth = minw;
        if (minh > 0) minHeight = minh;
        if (maxw > 0) maxWidth = maxw;
        if (maxh > 0) maxHeight = maxh;

        document.body.style.cursor = 'nesw-resize';
    };

    const move = (e) => {
        const parentDiv = parentRef.current;
        const div = buttonRef.current;
        const winWidth = window.innerWidth;

        const posY = e.pageY - offsetY < 0 ? 0 : e.pageY - offsetY;
        const offset = div.offsetWidth - offsetX;
        const posX = e.pageX + offset > winWidth ? winWidth : e.pageX + offset;

        const height = lastTop + lastHeight - posY;
        if (height > minHeight && height < maxHeight) {
            parentDiv.style.top = posY + 'px';
            parentDiv.style.height = height + 'px';
        }

        const width = posX - lastLeft;
        if (width > minWidth && width < maxWidth)
            parentDiv.style.width = width + 'px';

        resizeCallback?.();
    };

    const stopMove = (e) => {
        document.body.style.cursor = 'default';
        resizeFinishedCallback?.();
    }

    // draggable hooks
    useDraggable(buttonRef, initMove, move, stopMove);

    return (
        <div ref={buttonRef} className={className}></div>
    );
}

// support % and px
function getSizeStyle(div, name)
{
    const style = window.getComputedStyle(div);
    if (!style) return 0;
    const strValue = style.getPropertyValue(name);
    if (!strValue) return 0;

    var value = parseInt(strValue);

    if (strValue.includes('%')) {
        if (name.includes('width'))
            value *= div.parentNode.offsetWidth / 100;
        else if (name.includes('height'))
            value *= div.parentNode.offsetHeight / 100;
    }

    return value;
}

export { TopLeftResizeButton };
