import { AnimationMixer, Color, Group, LoopOnce, MeshStandardMaterial } from "three";
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
import { models } from "../main";

class Player extends Group {
    
    currentAction = null;
    lastAction = null;

    constructor()
    {
        super();

        const gltf = models["player"].gltf;
        this.scene = new SkeletonUtils.clone(gltf.scene);

        this._initMesh();
        this._initAnimation(gltf.animations);
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
            this.actions[clip.name] = action;
        });
    }

    /*
        Update
    */

    update(dt)
    {
        this.mixer.update(dt);
    }

    /*
        Action fading
    */

    setAction(name)
    {
        this.lastAction = this.currentAction;
        this.currentAction = this.actions[name];
    }

    crossFade(name, duration, warp = false)
    {
        this.setAction(name);

        if (this.lastAction) {
            this.currentAction.enabled = true;
            this.currentAction.setEffectiveTimeScale(1.0);
            this.currentAction.setEffectiveWeight(1.0);
            this.currentAction.crossFadeFrom(this.lastAction, duration, warp);
        }

        this.currentAction.play();
    }

    synchronizedCrossFade(name, duration, warp = false)
    {
        this.crossFade(name, duration, warp);
        if (this.lastAction) {
            const duration = this.currentAction.getClip().duration;
            const lastDuration = this.lastAction.getClip().duration;
            const ratio = duration / lastDuration;
            this.currentAction.time = this.lastAction.time * ratio;
        }
    }
}

export { Player };
