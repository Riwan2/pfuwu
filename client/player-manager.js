import { BoxGeometry, Color, InstancedMesh, Matrix4, MeshStandardMaterial, Scene, StreamDrawUsage } from "three";
import { serverPlayers } from "./network/client";

/**
 * @type {InstancedMesh}
 */
var instancedMesh;
var maxPlayersNumber;

class PlayerManager {

    /**
     * 
     * init instanced mesh
     * @param {Scene} scene 
     * @param {*} numberOfPlayers
     */
    constructor(scene, playersNumber = 50)
    {
        maxPlayersNumber = playersNumber;
        initInstancedMesh();
        scene.add(instancedMesh);
    }

    /**
     * 
     * Update players position and rotation based of server input
     * @param {*} dt 
     */
    update(dt)
    {
        // number of instances renderered, can't exceed maxPlayersNumber
        const nbPlayers = Math.min(serverPlayers.length, maxPlayersNumber);
        instancedMesh.count = nbPlayers;
        for (let i = 0; i < nbPlayers; i++) {
            const playerData = serverPlayers[i];
            const mat = new Matrix4().fromArray(playerData.matrix.elements);
            instancedMesh.setMatrixAt(i, mat);
        }
        instancedMesh.instanceMatrix.needsUpdate = true;
    }
}

/**
 * 
 * @param {InstancedMesh} mesh 
 * @param {*} numberOfInstance 
 */
function initInstancedMesh()
{
    const geometry = new BoxGeometry(2, 5);
    const material = new MeshStandardMaterial({color: new Color("red")});
    instancedMesh = new InstancedMesh(geometry, material, maxPlayersNumber);
    instancedMesh.instanceMatrix.setUsage(StreamDrawUsage);
}

export { PlayerManager };
