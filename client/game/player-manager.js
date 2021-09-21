import { NetworkManager } from "game/network/network-manager";
import { Player } from "game/player/player";

class PlayerManager {
    nbPlayers;
    lastNbPlayers;
    maxNbPlayers;

    players;

    constructor(scene, playersNumber = 20)
    {
        this.maxNbPlayers = playersNumber;
        this.nbPlayers = 0;
        this.lastNbPlayers = this.nbPlayers;

        this.players = [];

        for (let i = 0; i < this.maxNbPlayers; i++) {
            const player = new Player();
            player.matrixAutoUpdate = false;
            player.visible = false;

            scene.add(player);
            this.players.push(player);
        }

        this.scene = scene;
    }

    /**
     * 
     * Update players position and rotation based on server input
     * @param {*} dt 
     */
    update(dt)
    {
        // number of instances renderered, can't exceed maxNbPlayers
        this.lastNbPlayers = this.nbPlayers;
        this.nbPlayers = NetworkManager.players.length;

        if (this.nbPlayers > this.maxNbPlayers) {
            this.nbPlayers = this.maxNbPlayers;
            console.error("number max of players: ", this.maxNbPlayers);
        }

        if (this.nbPlayers == 0 && this.lastNbPlayers == 0) {
            // console.error("0 players on the server!");
            return;
        }

        for (let i = 0; i < this.lastNbPlayers; i++) {
            // i < maxNbPlayers
            const player = this.players[i];

            if (i < this.nbPlayers) {
                // handle logic and make visible server players
                const networkData = NetworkManager.players[i];
                const position = networkData.position;
                const rotation = networkData.rotation;
                const isMoving = networkData.isMoving;
                const isRunning = networkData.isRunning;

                // update position
                player.position.copy(position);
                player.rotation.copy(rotation);

                // update player
                player.isMoving = isMoving;
                player.isRunning = isRunning;
                player.updateMatrix();
                player.update(dt);

                // render player
                player.visible = true;

            } else {
                // don't render this player object anymore
                player.visible = false;
            }
        }
    }
}

export { PlayerManager };
