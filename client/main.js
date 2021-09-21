import { Chat } from "game/chat/chat";
import { InputManager } from "input";
import { World } from "game/world";

/* THREE JS */
const gameContainer = document.getElementById("threejs-canvas");
gameContainer.onclick = () => {
    InputManager.blockInputTag("player", false);
}

/** @type {World} */
var gameWorld;
var contextChanged = true;

/*
    Main function
*/

async function main() 
{
    gameWorld = new World(gameContainer);
    await gameWorld.loadGame();

    InputManager.init(gameContainer);
    update();
}

/*
    Update loop
*/

function update()
{
    requestAnimationFrame(update);
    gameWorld.render();
    swapContext();
    InputManager.update();
    contextChanged = false;
}

/*
    focus game
*/

function focusGame()
{
    gameContainer.focus();
    contextChanged = true;
}

/*
    Swap GUI Context
*/

InputManager.registerInput("chat-focus", ["Tab", "Enter"], "gui", true);

function swapContext()
{
    if (InputManager.keyPressed("chat-focus") && !contextChanged) {
        Chat.focus();
    }
}

/*
    Catch errors
*/

main().catch((err) => {
    console.log(err);
})

export { focusGame, gameWorld }
