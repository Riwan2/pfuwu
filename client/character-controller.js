import { Vector3 } from "three";
import { InputManager } from "./input/input";

/*
    Basic character controller
*/

class CharacterController {
    direction;
    velocity;
    speed;
    acceleration;
    friction;

    rotationDirection;
    rotationVelocity;
    rotationSpeed;

    character;

    constructor(object3D) 
    {
        this.direction = new Vector3(0, 0, 0);
        this.velocity = new Vector3(0, 0, 0);
        this.speed = 20;
        this.acceleration = 0.6;
        this.friction = 0.2;
        
        this.rotationDirection = 0;
        this.rotationVelocity = 0;
        this.rotationSpeed = Math.PI;

        this.character = object3D;
    }

    move(direction)
    {
        this.direction = direction;
    }

    /**
     * 
     * @param {*} rotationDirection can only be equal to -1, 1 or 0
     */
    rotate(rotationDirection)
    {
        this.rotationDirection = rotationDirection;
    }

    update(dt)
    {
        this.rotationVelocity = this.rotationDirection * this.rotationSpeed * dt;
        this.character.rotation.y = (this.character.rotation.y + this.rotationVelocity) % (2 * Math.PI);

        this.direction.normalize();

        if (this.direction.length() > 0) { // is moving
            // apply acceleration
            this.velocity.lerp(this.direction, this.acceleration);
        }

        // apply friction
        this.velocity.lerp(this.direction, this.friction);

        const finalVelocity = this.velocity.clone();
        finalVelocity.multiplyScalar(this.speed * dt);
        finalVelocity.applyQuaternion(this.character.quaternion);

        this.character.position.add(finalVelocity);
        this.character.matrixWorldNeedsUpdate = true;
    }
}

/*
    Input character controller
*/

class InputCharacterController extends CharacterController {
    constructor(object3D) 
    {
        super(object3D);
    }

    update(dt)
    {
        var rotationDirection = 0;
        const direction = new Vector3(0, 0, 0);

        if (InputManager.keyDown("player-turn-right")) {
            rotationDirection = 1;
        } else if (InputManager.keyDown("player-turn-left")) {
            rotationDirection = -1;
        }
        
        if (InputManager.keyDown("player-up")) {
            direction.z = 1;
        } else if (InputManager.keyDown("player-down")) {
            direction.z = -1;
        }

        if (InputManager.keyDown("player-right")) {
            direction.x = -1;
        } else if (InputManager.keyDown("player-left")) {
            direction.x = 1;
        }

        super.rotate(rotationDirection);
        super.move(direction);

        super.update(dt);
    }
}

export { CharacterController, InputCharacterController };
