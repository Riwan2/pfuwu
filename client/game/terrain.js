import { Color, LineBasicMaterial, LineSegments, Mesh, MeshStandardMaterial, PlaneGeometry, Raycaster, Vector3, WireframeGeometry } from "three";
import { InputManager } from "../input/input";

class MouseIntersect 
{
    constructor()
    {
        this.active = false;
        this.point = new Vector3(0, 0, 0);
        this.normal = new Vector3(0, 1, 0);
        this.tileX = 0;
        this.tileY = 0;
    }
}

class Terrain extends Mesh {
    constructor(width = 100, height = 100, resWidth = 10, resHeight = 10) 
    {
        super();

        this.width = 0;
        this.height = 0;
        this.tileWidth = 0;
        this.tileHeight = 0;

        initPlane(this, width, height, resWidth, resHeight);

        this.material = new MeshStandardMaterial({color: new Color("white")});
        this.material.color.convertSRGBToLinear();
        this.rotation.set(-Math.PI / 2, 0, 0);

        const wireframe = new WireframeGeometry(this.geometry);
        this.wireframeMaterial = new LineBasicMaterial({color: new Color('white')});
        this.wireframe = new LineSegments(wireframe, this.wireframeMaterial);
        this.wireframe.translateZ(0.1);
        this.wireframeActive = false;

        this.raycaster = new Raycaster();
        this.mouseIntersect = new MouseIntersect();
    }

    turnWireframe() {
        this.wireframeActive = !this.wireframeActive;
        if (!this.wireframeActive)
            this.remove(this.wireframe);
        else 
            this.add(this.wireframe);
    }

    mouseRaycast(camera) {
        this.raycaster.setFromCamera(InputManager.mouse.pos, camera);
        const intersect = this.raycaster.intersectObject(this);

        this.mouseIntersect.active = false;

        if (intersect.length > 0) {
            this.mouseIntersect.active = true;
            this.mouseIntersect.point = intersect[0].point;
            this.mouseIntersect.normal = intersect[0].face.normal.applyQuaternion(this.quaternion); 
            getTile(this);
        }
    }
}

/**
 * @param {Terrain} terrain 
 */
function initPlane(terrain, width, height, resWidth, resHeight)
{
    terrain.geometry = new PlaneGeometry(width, height, resWidth, resHeight);
    terrain.width = width;
    terrain.height = height;
    terrain.tileWidth = width / resWidth;
    terrain.tileHeight = height / resHeight;
}

/**
 * @param {Terrain} terrain 
 */
function getTile(terrain)
{
    const terrainPoint = terrain.mouseIntersect.point.clone().sub(terrain.position);
    terrainPoint.add(new Vector3(terrain.width, 0, terrain.height).multiplyScalar(0.5));
    terrain.mouseIntersect.tileX = Math.floor(terrainPoint.x / terrain.tileWidth);
    terrain.mouseIntersect.tileY = Math.floor(terrainPoint.z / terrain.tileHeight);
}

export { Terrain };
