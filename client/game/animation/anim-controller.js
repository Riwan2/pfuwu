import { AnimationMixer } from "three";

class AnimController {
    constructor(animObject, animations)
    {
        this.mixer = new AnimationMixer(animObject);
        this.actions = {};

        animations.forEach((clip) => {
            const action = this.mixer.clipAction(clip);
            this.actions[clip.name] = action;
        });

        this.currentAction = this.actions[0];
        this.lastAction = this.currentAction;
    }

    update(dt)
    {
        this.mixer.update(dt);
    }

    setAction(name)
    {
        const action = this.actions[name];
        if (!action) {
            console.error("animation name doesn't exist: ", name);
            return;
        }

        this.lastAction = this.currentAction;
        this.currentAction = action;
    }

    crossFade(name, duration)
    {
        this.setAction(name);

        if (this.lastAction) {
            this.currentAction.enabled = true;
            this.currentAction.setEffectiveTimeScale(1.0);
            this.currentAction.setEffectiveWeight(1.0);
            this.currentAction.crossFadeFrom(this.lastAction, duration);
        }

        this.currentAction.play();
    }

    synchroCrossFade(name, duration)
    {
        this.crossFade(name, duration);

        if (this.lastAction) {
            const duration = this.currentAction.getClip().duration;
            const lastDuration = this.lastAction.getClip().duration;
            const ratio = duration / lastDuration;
            this.currentAction.time = this.lastAction.time * ratio;
        }
    }
}

export { AnimController };
