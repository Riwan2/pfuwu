import { BoxGeometry, Color, InstancedMesh, MeshStandardMaterial, Object3D, Scene, StreamDrawUsage} from "three";
import { serverPlayers } from "../client";

class Minion extends Object3D {
    constructor(height)
    {
        super();
        this.height = height;
        this.position.y = height / 2;
        this.matrixWorldNeedsUpdate = true;
    }

    update()
    {
        this.matrixWorldNeedsUpdate = true;
    }
};

class MinionManager {
    minions = [];
    
    /**
     * 
     * @param {Scene} scene 
     */
    constructor(scene)
    {
        this.geometry = new BoxGeometry(2, 5);
        this.material = new MeshStandardMaterial({color: new Color('red')});
        this.number = 100;

        this.mesh = new InstancedMesh(this.geometry, this.material, this.number);
        this.mesh.instanceMatrix.setUsage(StreamDrawUsage);
        scene.add(this.mesh);

        this.update(0);
    }

    spawn()
    {
        const minion = new Minion(this.geometry.parameters.height);
        this.minions.push(minion);
        return minion;
    }

    update()
    {
        this.minions = [];

        if (serverPlayers) {
            for (const player of serverPlayers) {
                var minion = new Minion(this.geometry.parameters.height);
                minion.position.copy(player.pos);
                minion.rotation.copy(player.rot);
                this.minions.push(minion);
            }
        }

        this.mesh.count = this.minions.length;

        for (let i = 0; i < this.minions.length; i++) {
            const minion = this.minions[i];

            if (minion.matrixWorldNeedsUpdate) {
                minion.updateMatrixWorld();
                this.mesh.setMatrixAt(i, minion.matrixWorld);
                this.mesh.instanceMatrix.needsUpdate = true;
            }
        }
    }


}

export { Minion, MinionManager };