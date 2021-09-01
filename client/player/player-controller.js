import { Vector3 } from "three";
import { InputManager } from "../input/input";

var velocity = new Vector3(0, 0, 0);
var finalVelocity = new Vector3(0, 0, 0);

const rotationSpeed = Math.PI;
const speed = 50;
const acceleration = 0.6;
const friction = 0.2;

class PlayerController {
    minion;

    /**
     * 
     */
    constructor(minion)
    {
        InputManager.registerInput("player-up", [ "KeyW", "ArrowUp" ]);
        InputManager.registerInput("player-down", [ "KeyS", "ArrowDown" ]);
        InputManager.registerInput("player-right", [ "KeyD", "ArrowRight" ]);
        InputManager.registerInput("player-left", [ "KeyA", "ArrowLeft" ]);

        InputManager.registerInput("player-turn-right", [ "KeyQ" ]);
        InputManager.registerInput("player-turn-left", [ "KeyE" ]);

        this.minion = minion;
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
            frameVelocity.z = -1;
        } else if (InputManager.keyDown("player-down")) {
            frameVelocity.z = 1;
        }

        if (InputManager.keyDown("player-right")) {
            frameVelocity.x = 1;
        } else if (InputManager.keyDown("player-left")) {
            frameVelocity.x = -1;
        }

        rotationVelocity *= rotationSpeed * dt;
        this.minion.rotation.y = (this.minion.rotation.y + rotationVelocity) % (2 * Math.PI);

        frameVelocity.normalize();

        if (frameVelocity.length() > 0) { // is moving
            // apply acceleration
            velocity.lerp(frameVelocity, acceleration);
        }

        // apply friction
        velocity.lerp(frameVelocity, friction);

        finalVelocity = velocity.clone();
        finalVelocity.multiplyScalar(speed * dt);
        finalVelocity.applyQuaternion(this.minion.quaternion);

        this.minion.position.add(finalVelocity);
        this.minion.matrixWorldNeedsUpdate = true;
    }
}

export { PlayerController };
