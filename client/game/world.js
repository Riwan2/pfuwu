import { AmbientLight, Clock, Color, PerspectiveCamera, PointLight, Scene, sRGBEncoding, WebGLRenderer } from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { NetworkManager } from "game/network/network-manager";
import { PlayerManager } from "game/player-manager";
import { Player, PlayerController } from "game/player/player";
import { ThirdPersonCamera } from "game/player/third-person-camera";
import { Terrain } from "game/terrain";

const models = {
    player: { url: "chibi-character.glb" },
};

async function load_gltf()
{
    const loader = new GLTFLoader();
    loader.setPath("assets/gltf/");

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('three/examples/js/libs/draco/');
    loader.setDRACOLoader(dracoLoader);

    for (const modelName in models) {
        const model = models[modelName];
        const fileName = model.url;
        model.gltf = await loader.loadAsync(fileName);
    }
}

class World {

    constructor(container)
    {
        // game window
        this.container = container
        this.isRunning = true;

        // rendering
        this.#initRenderer();
        this.#initScene();
        this.#initCamera();

        // events
        this.#initEventListeners();
    }

    /*
        Init
    */

    #initRenderer()
    {
        this.renderer = new WebGLRenderer();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.physicallyCorrectLights = true;
        this.renderer.shadowMap.enabled = true;
        this.renderer.outputEncoding = sRGBEncoding;
        this.renderer.setPixelRatio(1);
        this.container.appendChild(this.renderer.domElement);
    }

    #initScene()
    {
        this.scene = new Scene();
        this.scene.background = new Color("cadetblue");
    }

    #initCamera()
    {
        const ratio = this.container.clientWidth / this.container.clientHeight;
        const fov = 75;
        const nearPlane = 0.1;
        const farPlane = 1000;
        this.camera = new PerspectiveCamera(fov, ratio, nearPlane, farPlane);
    }

    /*
        Resize
    */

    #resize()
    {
        const ratio = this.container.clientWidth / this.container.clientHeight;
        this.camera.aspect = ratio;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(2);
    }

    /*
        Event listener
    */

    #initEventListeners()
    {
        window.addEventListener('resize', () => {
            this.#resize();
        })
    }

    /*
        Load game
    */

    async loadGame()
    {
        // load assets
        await load_gltf();

        // lights
        const ambientLight = new AmbientLight("white", 1);  
        this.scene.add(ambientLight);

        const pointLight = new PointLight("white", 8, 300);
        pointLight.position.set(5, 10, 5);
        this.scene.add(pointLight);

        // terrain
        this.terrain = new Terrain(500, 500, 50, 50);
        this.terrain.receiveShadow = true;
        this.scene.add(this.terrain);

        // stats
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);

        // player controller
        this.player = new Player();
        this.playerController = new PlayerController(this.player);
        this.scene.add(this.player);

        // players manager
        this.playerManager = new PlayerManager(this.scene);

        // Third person camera
        this.thirdPersonCamera = new ThirdPersonCamera(this.camera);

        // update settings
        this.clock = new Clock();
        this.clockSpeed = 1;
    }

    /*
        Render
    */

    render()
    {
        if (!this.isRunning) return;
        // delta time
        this.delta = this.clock.getDelta() * this.clockSpeed;

        this.terrain.mouseRaycast(this.camera);

        // player controller
        this.playerController.update(this.delta);
        NetworkManager.sendPlayerInfo(this.player);

        // players manager
        this.playerManager.update(this.delta);

        // camera
        this.thirdPersonCamera.update(this.delta, this.player);

        // render scene
        this.renderer.render(this.scene, this.camera);

        this.stats.update();
    }
}

export { World, models }
