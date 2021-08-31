import { Vector2 } from "three";

var inputMap = {};
var keyState = {};
var lastKeyState = {};

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
        container.addEventListener("keydown", handleKeyDown, false);
        container.addEventListener("keyup", handleKeyUp, false);
        container.addEventListener("mousemove", (event) => { handleMouseMove(event, container) }, false);
        container.addEventListener("mousedown", handleMouseDown, false);
        container.addEventListener("mouseup", handleMouseUp, false);
        container.addEventListener("mouseout", handleMouseOut, false);
        container.addEventListener("wheel", handleMouseScroll, false);
    }

    static registerInput(name, keyAlias)
    {
        for (const key in inputMap) {
            if (key === name)
                throw Error("input already registered", name);
        }
        inputMap[name] = keyAlias;
    }

    static keyDown(inputName)
    {
        var input = inputMap[inputName];
        if (!input) {
            console.error("input name doesn't exist: ", inputName);
            return false;
        }
        for (const key of input) {
            if (!!(keyState[key]))
                return true;
        }
        return false;
    }

    static keyPressed(inputName)
    {
        var input = inputMap[inputName];
        if (!input) {
            console.error("input name doesn't exist: ", inputName);
            return false;
        }
        for (const key of input) {
            if (!!(keyState[key]) && !(lastKeyState[key]))
                return true;
        }
        return false;
    }

    static update()
    {
        lastKeyState = {};
        for (const key in keyState) {
            lastKeyState[key] = keyState[key];
        }
        this.mouse.scroll = 0;
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
    keyState[event.code] = true;
}

function handleKeyUp(event)
{
    if (!event.key) return;
    delete keyState[event.code];
}

export { InputManager };