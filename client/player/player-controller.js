import { InputCharacterController } from "../character-controller";
import { InputManager } from "../input/input";
import { StateMachine, State } from "../state-machine";
import { Player } from "./player"

// move
InputManager.registerInput("player-up", [ "KeyW", "ArrowUp" ]);
InputManager.registerInput("player-down", [ "KeyS", "ArrowDown" ]);
InputManager.registerInput("player-right", [ "KeyD", "ArrowRight" ]);
InputManager.registerInput("player-left", [ "KeyA", "ArrowLeft" ]);
// turn
InputManager.registerInput("player-turn-right", [ "KeyQ" ]);
InputManager.registerInput("player-turn-left", [ "KeyE" ]);
// run
InputManager.registerInput("player-run", [ "ShiftLeft" ]);

class PlayerController {
    /**
     * @type {Player}
     */
    player;

    /**
     * 
     * @param {Player} player 
     */
    constructor(player)
    {
        this.controller = new InputCharacterController(player);
        this.player = player;
        
        this.stateMachine = new StateMachine();
        this.stateMachine.addState("idle", IdleState, this);
        this.stateMachine.addState("walking", WalkState, this);
        this.stateMachine.addState("running", RunState, this);
        this.stateMachine.setState("idle");
    }

    update(dt)
    {
        this.controller.update(dt);
        this.stateMachine.update(dt);
        this.player.update(dt);
    }
}

/*
    Animation States
*/

class IdleState extends State {
    transition()
    {
        this.data.player.crossFade("TPose", 0.5);
        return true;
    }
     
    update(dt)
    {
        const controller = this.data.controller;
        // is moving
        if (controller.velocity.length() > 0.01)
            this.parent.setState("walking");
    }
}

class WalkState extends State {
    transition()
    {
        const lastState = this.parent.lastState.name;
        var time = 0;

        if (lastState === "idle") time = 0.3;
        if (lastState === "running") time = 0.2;

        if (time != 0) {
            this.data.player.crossFade("Walk", time);
            this.data.controller.speed = 20;
            return true;
        }
    }

    update(dt)
    {
        const controller = this.data.controller;
        const lastAction = this.data.player.lastAction;
        // is stopped
        if (controller.velocity.length() < 0.01)
            this.parent.setState("idle");
        // is running
        if (InputManager.keyDown("player-run") && !lastAction.enabled) {
            this.parent.setState("running");
        }
        
    }
}

class RunState extends State {
    transition()
    {
        const lastState = this.parent.lastState.name;

        if (lastState === "walking") {
            this.data.player.synchronizedCrossFade("GoofyRun", 0.3);
            this.data.controller.speed = 30;
            return true;
        }
    }

    update(dt)
    {
        const controller = this.data.controller;
        const lastAction = this.data.player.lastAction;
        // is stopped
        if (controller.velocity.length() < 0.01)
            this.parent.setState("idle");
        // is running
        if (!InputManager.keyDown("player-run") && !lastAction.enabled)
            this.parent.setState("walking");
    }
};

export { PlayerController };
