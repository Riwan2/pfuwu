import { AmbientLight, Clock, Color, PerspectiveCamera, PointLight, Scene, sRGBEncoding, WebGLRenderer} from "three";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { Chat } from "./chat/chat";
import { Terrain } from "./terrain";

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { InputManager } from "./input/input";
import { ThirdPersonCamera } from "./player/third-person-camera";
import { Player, PlayerController } from "./player/player";
import { PlayerManager } from "./player-manager";
import { NetworkManager } from "./network/network-manager";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

/* THREE JS */
const gameContainer = document.getElementById("threejs-canvas");

function setSize(camera, renderer, container) 
{
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(2);
}

const models = {
    player: { url: "chibi-character.glb" },
};

async function load_gltf()
{
    const loader = new GLTFLoader();
    loader.setPath("../assets/gltf/");

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('three/examples/js/libs/draco/');
    loader.setDRACOLoader(dracoLoader);

    for (const modelName in models) {
        const model = models[modelName];
        const fileName = model.url;
        model.gltf = await loader.loadAsync(fileName);
    }
}

async function main() 
{
    // renderer
    const renderer = new WebGLRenderer({powerPreference: "high-performance"});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.physicallyCorrectLights = true;
    renderer.shadowMap.enabled = true;
    renderer.outputEncoding = sRGBEncoding;
    renderer.setPixelRatio(1);
    gameContainer.appendChild(renderer.domElement);

    // scene & window
    const scene = new Scene();
    scene.background = new Color('cadetblue');
    const camera = new PerspectiveCamera(75,
    window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 25, 30);

    // resize
    setSize(camera, renderer, gameContainer);
    window.addEventListener('resize', () => {
        setSize(camera, renderer, gameContainer);
        Chat.scrollDown();
    })

    // light and scene stuff
    const ambientLight = new AmbientLight('white', 1);  
    scene.add(ambientLight);

    const pointLight = new PointLight('white', 8, 300);
    pointLight.position.set(5, 10, 5);

    scene.add(pointLight);

    // terrain
    const terrain = new Terrain(500, 500, 50, 50);
    terrain.receiveShadow = true;
    scene.add(terrain);

    // stats
    const stats = new Stats();
    document.body.appendChild(stats.dom);

    // load
    await load_gltf();

    // input
    InputManager.init(gameContainer);

    // player controller
    const player = new Player();
    const playerController = new PlayerController(player);
    scene.add(player);

    // players manager
    const playerManager = new PlayerManager(scene);

    // Third person camera
    const thirdPersonCamera = new ThirdPersonCamera(camera);

    // chat
    InputManager.registerInput("focus-chat", ["Enter", "Tab"]);

    // update settings
    const clock = new Clock();
    const speed = 1;

    const animate = () => {
        requestAnimationFrame(animate);
        
        // delta time
        const dt = clock.getDelta() * speed;

        // focus chat
        if (InputManager.keyPressed("focus-chat"))
            Chat.focus();

        // controls.update(dt);
        terrain.mouseRaycast(camera);

        // player controller
        playerController.update(dt);
        NetworkManager.sendPlayerInfo(player);

        // players manager
        playerManager.update(dt);

        // camera
        thirdPersonCamera.update(dt, player);

        // render scene
        renderer.render(scene, camera);

        stats.update();
        InputManager.update();
    }
    animate();
}

main().catch((err) => {
    console.log(err);
})

export { gameContainer, models }
