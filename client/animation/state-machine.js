
class State {
    /**
     * parent state machine of the state
     * @type {StateMachine}
    */
    parent
    /**
     * data transmited to the state
     * @type {*}
    */
     data;
    /**
     * name of the states
     * @type {String}
    */
    name;
    /**
     * @returns true if the transition conditions
     * are fullfilled, else false.
     */
    transition() { return true }
    /**
     * method called every frames, contains state logic.
     * @param {*} dt delta time
     */
    update(dt) {}
}

class StateMachine {
    states;
    currentState;
    lastState;

    constructor()
    {
        this.states = {};
        this.currentState = { name: null };
    }

    addState(name, type, data)
    {
        if (this.states[name]) {
            console.error("state already exist: ", name);
            return;
        }

        this.states[name] = new type();
        this.states[name].parent = this;
        this.states[name].data = data;
        this.states[name].name = name;
    }

    setState(name)
    {
        const state = this.states[name];
        // state doesn't exist ?
        if (!state) {
            // console.error("state doesn't exist:", name);
            return;
        }
        // last state equal to current state ?
        this.lastState = this.currentState;
        if (this.lastState.name === name) {
            // console.error("current state equal to last state:", name);
            return
        }
        // transition failed ?
        if (!state.transition()) {
            // console.error("state transition refused:", state);
            return;
        }
        // success, state updated
        this.currentState = state;
    }

    update(dt)
    {
        if (this.currentState.update)
            this.currentState.update(dt);
    }

};

export { StateMachine, State };
