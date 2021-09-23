import { Vector2 } from "three";

var inputMap = {};
var lastInputMap = {};

class Mouse
{
    pos = new Vector2(-2, -2);
    down = false;
    downPos = new Vector2(0, 0);
    drag = new Vector2(0, 0);
    scroll = 0;
}

class InputManager 
{
    static mouse = new Mouse();

    static init(container)
    {
        window.addEventListener("keydown", handleKeyDown, false);
        window.addEventListener("keyup", handleKeyUp, false);
        window.addEventListener("focusout", this._resetInput, false);
        container.addEventListener("mousemove", (event) => { handleMouseMove(event, container) }, false);
        container.addEventListener("mousedown", handleMouseDown, false);
        container.addEventListener("mouseup", handleMouseUp, false);
        container.addEventListener("mouseout", handleMouseOut, false);
        container.addEventListener("wheel", handleMouseScroll, { passive: false });
    }

    static _resetInput()
    {
        for (const key in inputMap) {
            const input = inputMap[key];
            input.down = false;
        }
    }

    static registerInput(name, keyAlias, tag = "basic", preventDefault = false)
    {
        for (const key in inputMap) {
            if (key === name)
                throw Error("input already registered", name);
        }
        
        inputMap[name] = { 
            "keyAlias": keyAlias, 
            "down": false, 
            "preventDefault": preventDefault,
            "tag": tag,
            "blocked": false,
        };
    }

    static blockInputTag(name, blocked = true)
    {
        for (const key in inputMap) {
            const input = inputMap[key];
            if (input.tag === name)
                input.blocked = blocked;
        }
    }

    static keyDown(inputName)
    {
        var input = inputMap[inputName];
        if (!input) {
            console.error("input name doesn't exist: ", inputName);
            return false;
        }
        return input.down;
    }

    static keyPressed(inputName)
    {
        var input = inputMap[inputName];
        if (!input) {
            console.error("input name doesn't exist: ", inputName);
            return false;
        }
        var lastInput = lastInputMap[inputName];
        return (input.down && !lastInput);
    }

    static update()
    {
        this.mouse.scroll = 0;

        lastInputMap = {};
        for (const key in inputMap) {
            if (inputMap[key].down)
                lastInputMap[key] = true;
        }
    }
}

function handleMouseScroll(event)
{
    InputManager.mouse.scroll = event.deltaY;
    event.preventDefault();
}

function handleMouseOut(event)
{
    InputManager.mouse.down = false;
}

function handleMouseDown(event)
{
    const mouse = InputManager.mouse;
    mouse.down = true;
    mouse.downPos = mouse.pos.clone();
}

function handleMouseUp(event)
{
    const mouse = InputManager.mouse;
    mouse.down = false;
    mouse.drag.set(0, 0);
}

function handleMouseMove(event, container)
{
    const mouse = InputManager.mouse;
    mouse.pos.x = (event.clientX / container.clientWidth) * 2 - 1;
    mouse.pos.y = -(event.clientY / container.clientHeight) * 2 + 1;
    
    if (mouse.down) {
        mouse.drag = mouse.pos.clone().sub(mouse.downPos);
    }
}

function handleKeyDown(event)
{
    if (!event.key) return;

    for (const key in inputMap) {
        const input = inputMap[key];
        for (const code of input.keyAlias) {
            if (event.code == code) {
                if (input.blocked) return;
                if (input.preventDefault) event.preventDefault();
                input.down = true;
                return;
            }
        }
    }
}

function handleKeyUp(event)
{
    if (!event.key) return;

    for (const key in inputMap) {
        const input = inputMap[key];
        for (const code of input.keyAlias) {
            if (event.code == code) {
                if (input.blocked) return;
                input.down = false;
                return;
            }
        }
    }
}

export { InputManager };
