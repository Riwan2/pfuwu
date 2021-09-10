import { BoxGeometry, Color, InstancedMesh, Matrix4, MeshStandardMaterial, Scene, StreamDrawUsage } from "three";
import { NetworkManager } from "./network/network-manager";
import { Player } from "./player/player";

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
        const nbPlayers = Math.min(NetworkManager.players.length, maxPlayersNumber);
        instancedMesh.count = nbPlayers;

        if (nbPlayers == 0) return;
        
        // populate instanced mesh matrices
        for (let i = 0; i < nbPlayers; i++) {
            const playerData = NetworkManager.players[i];
            const matrix = playerData.matrix;
            if (matrix) {
                const mat = new Matrix4().fromArray(matrix.elements);
                instancedMesh.setMatrixAt(i, mat);
            }
        }

        // update the instance matrix buffer
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
