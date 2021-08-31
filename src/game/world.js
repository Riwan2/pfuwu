import { AmbientLight, Clock, Color, PerspectiveCamera, PointLight, Scene, WebGLRenderer} from "three";
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { chatFocus, scrollDown } from "../chat";

// import * as TWEEN from '@tweenjs/tween.js';
import { Terrain } from "./terrain";
import { MinionManager } from "./minions";

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { PlayerController } from "./player-controller";
import { InputManager } from "./input";
import { ThirdPersonCamera } from "./third-person-camera";
import { sendPlayer } from "../client";
import { Player } from "./player";

/* THREE JS */
const container = document.getElementById("threejs-canvas");

function setSize(camera, renderer, container) 
{
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
}

async function load(scene)
{
}

function containerFocus()
{
    container.focus();
}

async function main() 
{
    const renderer = new WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.physicallyCorrectLights = true;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const scene = new Scene();
    scene.background = new Color('cadetblue');
    const camera = new PerspectiveCamera(75,
    window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 25, 30);

    // const controls = new OrbitControls(camera, container);
    // controls.enableDamping = true;

    // resize
    setSize(camera, renderer, container);
    window.addEventListener('resize', () => {
        setSize(camera, renderer, container);
        scrollDown();
    })

    // light and scene stuff
    const ambientLight = new AmbientLight('white', 1);
    scene.add(ambientLight);

    const pointLight = new PointLight('white', 8);
    pointLight.castShadow = true;
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // terrain
    const terrain = new Terrain(500, 500, 50, 50);
    terrain.receiveShadow = true;
    scene.add(terrain);

    // minions
    var minionManager = new MinionManager(scene);

    // stats
    const stats = new Stats();
    document.body.appendChild(stats.dom);

    // input
    InputManager.init(container);

    // player controller
    const player = new Player(4);
    scene.add(player);
    const playerController = new PlayerController(player);

    // focus chat
    container.onkeypress = (event) => {
        if (event.key == 'Enter') {
            chatFocus(event);
        }
    }

    // Third person camera
    const thirdPersonCamera = new ThirdPersonCamera(camera);

    // load
    await load(scene);

    // update settings
    const clock = new Clock();
    const speed = 1;

    const animate = () => {
        requestAnimationFrame(animate);

        const dt = clock.getDelta() * speed;
        // TWEEN.update();

        // controls.update(dt);
        terrain.mouseRaycast(camera);

        // player controller
        playerController.update(dt);
        sendPlayer(playerController.minion);

        minionManager.update();

        if (terrain.mouseIntersect.active) {
            const intersect = terrain.mouseIntersect;
            const point = intersect.point;
            const normal = intersect.normal;
            const tileX = intersect.tileX;
            const tileY = intersect.tileY;

            // const quat = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), normal);
            // cube.setRotationFromQuaternion(quat);
            // cube.position.x = tileX * terrain.tileWidth - terrain.width / 2 + terrain.tileWidth / 2;
            // cube.position.z = tileY * terrain.tileHeight - terrain.height / 2 + terrain.tileHeight / 2;

            // cube.position.copy(point);
            // cube.position.y = cube.geometry.parameters.height / 2;
        }

        // camera
        thirdPersonCamera.update(dt, playerController.minion);

        renderer.render(scene, camera);
        stats.update();
        InputManager.update();
    }
    animate();
}

main().catch((err) => {
    console.log(err);
})

export { containerFocus }