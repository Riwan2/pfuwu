import { Vector3, Object3D } from "three";
import { InputManager } from "../../input/input";

/*
    Basic character controller
*/

const yAxis = new Vector3(0, 1, 0);
const zAxis = new Vector3(0, 0, 1);


class CharacterController {
    direction;
    velocity;
    speed;
    acceleration;
    friction;
    
    isMoving;
    isRunning;
    speedRunning;

    rotationDirection;
    rotationVelocity;
    rotationSpeed;

    rotation;
    visualRotation;

    /**
     * @type {Object3D}
     */
    character;

    constructor(object3D) 
    {
        this.direction = new Vector3(0, 0, 0);
        this.velocity = new Vector3(0, 0, 0);
        this.speed = 20;
        this.acceleration = 0.6;
        this.friction = 0.2;
        
        this.isMoving = false;
        this.isRunning = false;
        this.speedRunning = 30;
        
        this.rotationDirection = 0;
        this.rotationVelocity = 0;
        this.rotationSpeed = Math.PI;

        this.rotation = new Vector3(0, 0, 0);
        this.visualRotation = new Vector3(0, 0, 0);

        this.character = object3D;
    }

    move(direction)
    {
        this.direction = direction;
    }

    rotateToDirection()
    {
        this.visualRotation.y = this.direction.angleTo(zAxis);
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
        // rotate on the y axis
        this.rotationVelocity = this.rotationDirection * this.rotationSpeed * dt;
        this.rotation.y = (this.rotation.y + this.rotationVelocity) % (2 * Math.PI);

        // normalize direction
        this.direction.normalize();
        if (this.direction.length() > 0) {
            // apply acceleration
            this.velocity.lerp(this.direction, this.acceleration);
        }

        // apply friction
        this.velocity.lerp(this.direction, this.friction);
        const finalVelocity = this.velocity.clone();

        // is moving ?
        this.isMoving = false;
        if (this.velocity.length() > 0.01)
            this.isMoving = true;

        var speed = this.speed;
        // is running ?
        if (this.isRunning) 
            speed = this.speedRunning;

        // apply speed to velocity
        finalVelocity.multiplyScalar(speed * dt);
        // apply direction
        finalVelocity.applyAxisAngle(yAxis, this.rotation.y);

        // only visual rotation, don't apply on velocity
        this.character.rotation.set(this.visualRotation.x, this.visualRotation.y, this.visualRotation.z);
        // move the character by velocity
        this.character.position.add(finalVelocity);
        // this.character.matrixWorldNeedsUpdate = true;
    }
}

/*
    Input character controller
*/

// move
InputManager.registerInput("player-up", [ "KeyW", "ArrowUp" ], "player");
InputManager.registerInput("player-down", [ "KeyS", "ArrowDown" ], "player");
InputManager.registerInput("player-right", [ "KeyD", "ArrowRight" ], "player");
InputManager.registerInput("player-left", [ "KeyA", "ArrowLeft" ], "player");
// turn
InputManager.registerInput("player-turn-right", [ "KeyQ" ], "player");
InputManager.registerInput("player-turn-left", [ "KeyE" ], "player");
// run
InputManager.registerInput("player-run", [ "ShiftLeft" ], "player");

class InputCharacterController extends CharacterController {
    constructor(object3D) 
    {
        super(object3D);
    }

    update(dt)
    {
        // init rotation and direction
        var rotationDirection = 0;
        const direction = new Vector3(0, 0, 0);

        // show where the character direction is
        this.visualRotation.setY(this.rotation.y);

        // turn the character
        if (InputManager.keyDown("player-turn-right")) {
            rotationDirection = 1;
        } else if (InputManager.keyDown("player-turn-left")) {
            rotationDirection = -1;
        }
        
        // move the character
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

        this.isRunning = false;
        // is running ?
        if (InputManager.keyDown("player-run"))
            this.isRunning = true;

        super.rotate(rotationDirection);
        super.move(direction);
        super.update(dt);
    }
}

export { CharacterController, InputCharacterController };
