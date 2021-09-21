import { Color, Group, MeshStandardMaterial } from "three";
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
import { AnimController } from "game/animation/anim-controller";
import { InputCharacterController } from "game/animation/character-controller";
import { State, StateMachine } from "game/animation/state-machine";

import * as Shared from "shared/test";
import { models } from "game/world";

Shared.hello();

class Player extends Group {
    animControl;
    stateMachine;
    isMoving;
    isRunning;

    constructor()
    {
        super();

        const gltf = models["player"].gltf;
        this.scene = new SkeletonUtils.clone(gltf.scene);
        this.animControl = new AnimController(this.scene, gltf.animations);

        this.isMoving = false;
        this.isRunning = false;
        
        this._initStates();
        this._initMesh();
    }

    update(dt)
    {
        this.stateMachine.update(dt);
        this.animControl.update(dt);
    }

    /*
        Init
    */

    _initStates()
    {
        this.stateMachine = new StateMachine();
        this.stateMachine.addState("idle", IdleState, this);
        this.stateMachine.addState("walking", WalkState, this);
        this.stateMachine.addState("running", RunState, this);
        this.stateMachine.setState("idle");
    }

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
        this.player.isMoving = this.controller.isMoving;
        this.player.isRunning = this.controller.isRunning;

        this.controller.update(dt);
        this.player.update(dt);
    }
}

export { Player, PlayerController };

/*
    Animation States
*/

class IdleState extends State {
    transition()
    {
        const animControl = this.data.animControl;
        if (animControl.lastAction && animControl.lastAction.enabled) return false;
        animControl.crossFade("TPose", 0.5);
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
        const animControl = this.data.animControl;
        if (animControl.lastAction && animControl.lastAction.enabled) return false;
        const lastState = this.parent.lastState.name;
        var time = 0;

        if (lastState === "idle") time = 0.3;
        if (lastState === "running") time = 0.7;

        if (time != 0) {
            animControl.crossFade("Walk", time);
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
        const animControl = this.data.animControl;
        if (animControl.lastAction && animControl.lastAction.enabled) return false;
        const lastState = this.parent.lastState.name;

        if (lastState === "walking") {
            animControl.synchroCrossFade("GoofyRun", 0.3);
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
