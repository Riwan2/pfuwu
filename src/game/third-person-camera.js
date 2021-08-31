import { Object3D, PerspectiveCamera, Vector3 } from "three";
import { clamp, lerp } from "three/src/math/MathUtils";
import { InputManager } from "./input";

const angleAroundSpeed = 3;
var nextAngleAround = 0;
var angleAroundOffset = 0;

const angleYSpeed = 1;
var nextAngleY = 0.4;
var angleYOffset = 0;

var nextDistance = 0;

class ThirdPersonCamera {
    camera;
    distance = 20;
    angleAround = 0;
    angleY = 0.4;

    /**
     * 
     * @param {PerspectiveCamera} perspectiveCamera 
     */
    constructor(perspectiveCamera)
    {
        this.camera = perspectiveCamera;
    }

    /**
     * 
     * @param {*} dt 
     * @param {Object3D} target 
     */    
    update(dt, target)
    {
        var rotationY = target.rotation.y + this.angleAround;

        const mouse = InputManager.mouse;

        if (mouse.down) {
            nextAngleAround = -mouse.drag.x * angleAroundSpeed + angleAroundOffset;
            nextAngleY = -mouse.drag.y * angleYSpeed + angleYOffset;
            nextAngleY = clamp(nextAngleY, -Math.PI / 2 + 0.2, Math.PI / 2 - 0.2);
        } else {
            angleAroundOffset = this.angleAround;
            angleYOffset = this.angleY;
        }

        nextDistance = this.distance - mouse.scroll * dt;
        this.distance = clamp(nextDistance, 10, 50);

        this.angleAround = lerp(this.angleAround, nextAngleAround, 0.1);
        this.angleY = lerp(this.angleY, nextAngleY, 0.1);

        var rotatedPos = new Vector3();
        const horizontalDistance = Math.cos(this.angleY) * this.distance;
        const verticalDistance = Math.sin(this.angleY) * this.distance;

        rotatedPos.x = horizontalDistance * Math.sin(rotationY) + target.position.x;
        rotatedPos.y = verticalDistance;
        rotatedPos.z = horizontalDistance * Math.cos(rotationY) + target.position.z;

        this.camera.position.copy(rotatedPos);
        // this.camera.position.lerp(desiredPos, 4.0 * dt);
        this.camera.lookAt(target.position);
    }
}

export { ThirdPersonCamera };