import { useEffect } from 'react';

function useDraggable(refDiv, initCallback, dragCallback, stopCallback)
{
    useEffect(() => {
        refDiv.current.addEventListener('mousedown', initDrag);
        return () => {
            refDiv.current.removeEventListener('mousedown', initDrag);
        };
    }, [refDiv]);

    const initDrag = (e) => {
        window.addEventListener('mousemove', drag);
        window.addEventListener('mouseup', stopDrag);
        if (initCallback) initCallback(e);
    }

    const drag = (e) => {
        if (dragCallback) dragCallback(e);
    }

    const stopDrag = (e) => {
        window.removeEventListener('mousemove', drag);
        window.removeEventListener('mouseup', stopDrag);
        if (stopCallback) stopCallback(e);
    }
}

function getDivOffset(childRef, parentRef, mouseX, mouseY) 
{
    const childDiv = childRef.current;
    const parentDiv = parentRef.current;
    const childLeft = childDiv.offsetLeft + parentDiv.offsetLeft;
    const childTop = childDiv.offsetTop + parentDiv.offsetTop;

    var offsetX = mouseX - childLeft;
    if (offsetX < 0) offsetX = 0;
    if (offsetX > childDiv.offsetWidth) offsetX = childDiv.offsetWidth;

    var offsetY = mouseY - childTop;
    if (offsetY < 0) offsetY = 0;
    if (offsetY > childDiv.offsetHeight) offsetY = childDiv.offsetHeight;

    return [offsetX, offsetY];
}

function screenDivCollision(div) 
{
    const width = div.offsetWidth;
    const height = div.offsetHeight;
    var collision = false;

    if (div.offsetLeft < 0) { 
        div.style.left = 0 + 'px'; 
        collision = true; 
    } else if (div.offsetLeft + width > window.innerWidth) { 
        div.style.left = window.innerWidth - width + 'px';
        collision = true;
    }
    
    if (div.offsetTop < 0) {
        div.style.top = 0 + 'px';
        collision = true;
    } else if (div.offsetTop + height > window.innerHeight) { 
        div.style.top = window.innerHeight - height + 'px';
        collision = true;
    }

    return collision;
}

export { useDraggable, getDivOffset, screenDivCollision };
