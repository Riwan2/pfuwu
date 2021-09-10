import { Vector3 } from "three";
import { InputManager } from "../input/input";
import { Player } from "./player"

var velocity = new Vector3(0, 0, 0);
var finalVelocity = new Vector3(0, 0, 0);

const rotationSpeed = Math.PI;
const speed = 50;
const acceleration = 0.6;
const friction = 0.2;


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
        InputManager.registerInput("player-up", [ "KeyW", "ArrowUp" ]);
        InputManager.registerInput("player-down", [ "KeyS", "ArrowDown" ]);
        InputManager.registerInput("player-right", [ "KeyD", "ArrowRight" ]);
        InputManager.registerInput("player-left", [ "KeyA", "ArrowLeft" ]);

        InputManager.registerInput("player-turn-right", [ "KeyQ" ]);
        InputManager.registerInput("player-turn-left", [ "KeyE" ]);

        this.player = player;
    }

    update(dt)
    {
        var frameVelocity = new Vector3(0, 0, 0);
        var rotationVelocity = 0;

        if (InputManager.keyDown("player-turn-right")) {
            rotationVelocity = 1;
        } else if (InputManager.keyDown("player-turn-left")) {
            rotationVelocity = -1;
        }
        
        if (InputManager.keyDown("player-up")) {
            frameVelocity.z = 1;
        } else if (InputManager.keyDown("player-down")) {
            frameVelocity.z = -1;
        }

        if (InputManager.keyDown("player-right")) {
            frameVelocity.x = -1;
        } else if (InputManager.keyDown("player-left")) {
            frameVelocity.x = 1;
        }

        rotationVelocity *= rotationSpeed * dt;
        this.player.rotation.y = (this.player.rotation.y + rotationVelocity) % (2 * Math.PI);

        frameVelocity.normalize();

        this.player.currentState = this.player.states.idle;

        if (frameVelocity.length() > 0) { // is moving
            // apply acceleration
            velocity.lerp(frameVelocity, acceleration);
            this.player.currentState = this.player.states.running;
        }

        // apply friction
        velocity.lerp(frameVelocity, friction);

        finalVelocity = velocity.clone();
        finalVelocity.multiplyScalar(speed * dt);
        finalVelocity.applyQuaternion(this.player.quaternion);

        this.player.position.add(finalVelocity);
        this.player.matrixWorldNeedsUpdate = true;

        this.player.update(dt);
    }
}

export { PlayerController };
