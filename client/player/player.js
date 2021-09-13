import { Color, Group, MeshStandardMaterial } from "three";
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
import { AnimController } from "../animation/anim-controller";
import { InputCharacterController } from "../animation/character-controller";
import { models } from "../main";
import { State, StateMachine } from "../animation/state-machine";

class Player extends Group {
    animControl;

    constructor()
    {
        super();

        const gltf = models["player"].gltf;
        this.scene = new SkeletonUtils.clone(gltf.scene);
        this.animControl = new PlayerAnimController(this.scene, gltf.animations);
        this._initMesh();
    }

    update(dt)
    {
        this.animControl.update(dt);
    }

    /*
        Init
    */

    _initMesh()
    {
        const material = new MeshStandardMaterial({color: new Color("yellow")});
        material.color.convertSRGBToLinear();

        this.scene.traverse((obj) => {
            if (obj.isMesh) {
                obj.material = material;
                obj.castShadow = true;
                obj.reveiveShadow = true;
            }
        })

        this.add(this.scene);
    }
}

/*
    Player controller
*/

class PlayerController {
    player;
    controller;

    constructor(player)
    {
        this.player = player;
        this.controller = new InputCharacterController(player);
    }

    update(dt)
    {
        this.player.animControl.isMoving = this.controller.isMoving;
        this.player.animControl.isRunning = this.controller.isRunning;

        this.controller.update(dt);
        this.player.update(dt);
    }
}

/*
    Player animation controller
*/

class PlayerAnimController extends AnimController {
    isMoving;
    isRunning;

    /**
     * 
     * @param {Player} player 
     */
    constructor(animObject, animations)
    {
        super(animObject, animations);

        this.isMoving = false;
        this.isRunning = false;
        
        this.stateMachine = new StateMachine();
        this.stateMachine.addState("idle", IdleState, this);
        this.stateMachine.addState("walking", WalkState, this);
        this.stateMachine.addState("running", RunState, this);
        this.stateMachine.setState("idle");
    }

    update(dt)
    {
        super.update(dt);
        this.stateMachine.update(dt);
    }
}

export { Player, PlayerController };

/*
    Animation States
*/

class IdleState extends State {
    transition()
    {
        if (this.data.lastAction && this.data.lastAction.enabled) return false;
        this.data.crossFade("TPose", 0.5);
        return true;
    }
     
    update(dt)
    {
        // is moving
        if (this.data.isMoving) {
            this.parent.setState("walking");
        }
    }
}

class WalkState extends State {
    transition()
    {
        if (this.data.lastAction && this.data.lastAction.enabled) return false;
        const lastState = this.parent.lastState.name;
        var time = 0;

        if (lastState === "idle") time = 0.3;
        if (lastState === "running") time = 0.7;

        if (time != 0) {
            this.data.crossFade("Walk", time);
            return true;
        }
    }

    update(dt)
    {
        // is stopped
        if (!this.data.isMoving)
            this.parent.setState("idle");
        // is running
        if (this.data.isRunning)
            this.parent.setState("running");
    }
}

class RunState extends State {
    transition()
    {
        if (this.data.lastAction && this.data.lastAction.enabled) return false;
        const lastState = this.parent.lastState.name;

        if (lastState === "walking") {
            this.data.synchroCrossFade("GoofyRun", 0.3);
            return true;
        }
    }

    update(dt)
    {
        // is stopped
        if (!this.data.isMoving)
            this.parent.setState("idle");
        // is running
        if (!this.data.isRunning)
            this.parent.setState("walking");
    }
};
