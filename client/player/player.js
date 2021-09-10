import { AnimationMixer, Color, Group, LoopOnce, MeshStandardMaterial } from "three";
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
import { models } from "../main";

class Player extends Group {
    
    currentState = null;
    lastState = null;
    currentAction = null;
    lastAction = null;

    constructor()
    {
        super();

        const gltf = models["player"].gltf;
        this.scene = new SkeletonUtils.clone(gltf.scene);

        this._initMesh();
        this._initAnimation(gltf.animations);
        this._initState();
    }

    /*
        Init
    */

    _initMesh()
    {
        const material = new MeshStandardMaterial({color: new Color("yellow")});

        this.scene.traverse((obj) => {
            if (obj.isMesh) {
                obj.material = material;
                obj.castShadow = true;
                obj.reveiveShadow = true;
            }
        })

        this.add(this.scene);
    }

    _initAnimation(animations)
    {
        this.mixer = new AnimationMixer(this.scene);
        this.actions = {};

        animations.forEach((clip) => {
            const action = this.mixer.clipAction(clip);

            switch (clip.name) {
                case "TPose":
                    action.loop = LoopOnce;
                    action.clampWhenFinished = true;
                    break;

                case "Goofy-Running":
                    break;
            }

            this.actions[clip.name] = action
        });

        this.currentAction = this.actions["TPose"];
        this.currentAction.play();
    }

    _initState()
    {
        this.states = { idle: "TPose", running: "Goofy-Running" };

        this.currentState = this.states.idle;
        this.lastState = this.currentState;
    }

    /*
        Update
    */

    update(dt)
    {
        this._updateState();
        this.mixer.update(dt);
    }

    /*
        Update State
    */

    _updateState()
    {
        if (this.lastState !== this.currentState) {
           this._fadeToAction(this.currentState, 0.2);
        }

        this.lastState = this.currentState;
    }

    /*
        Action fading
    */

    _fadeToAction(name, duration) 
    {
        this.lastAction = this.currentAction;
        this.currentAction = this.actions[name];

        if (this.lastAction !== this.currentAction) {
            this.lastAction.fadeOut(duration);
        }

        this.currentAction
            .reset()
            .setEffectiveTimeScale(1)
            .setEffectiveWeight(1)
            .fadeIn(duration)
            .play();
    }
}

export { Player };
