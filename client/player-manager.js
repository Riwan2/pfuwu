import { BoxGeometry, Color, InstancedMesh, Matrix4, MeshStandardMaterial, Scene, StreamDrawUsage, Vector3 } from "three";
import { CharacterController } from "./animation/character-controller";
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
    constructor(scene, playersNumber = 20)
    {
        maxPlayersNumber = playersNumber;
        initInstancedMesh();
        scene.add(instancedMesh);

        this.scene = scene;
        
        // this.players = []
        // for (let i = 0; i < playersNumber; i++) {
            // this.players.push(this.createPlayer());
        // }
    }

    createPlayer()
    {
        // const playerObject = new Player();
        // const controller = new CharacterController(playerObject);
        // const playerController = new PlayerAnimController(playerObject);

        // playerObject.visible = false;
        // playerObject.matrixAutoUpdate = false;

        // const player = { player: playerObject, controller: controller, playerController: playerController };
        // this.scene.add(player.player);
        // return player;
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

        // for (let i = 0; i < maxPlayersNumber; i++) {

        //     const player = this.players[i];
        //     const obj = player.player;

        //     if (i < nbPlayers) {
        //         const playerData = NetworkManager.players[i];
        //         const matrix = playerData.matrix;
                
        //         if (matrix) {
        //             const mat = new Matrix4().fromArray(matrix.elements);
        //             obj.matrix.copy(mat);
        //             obj.visible = true;
        //         }
                
        //         player.controller.move(new Vector3(0.1, 0.1, 0.1));
        //         player.playerController.update(dt);
        //     } else {
        //         obj.visible = false;
        //     }
        // }
        
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
