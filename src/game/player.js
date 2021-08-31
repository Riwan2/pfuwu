import { BoxGeometry, Color, Mesh, MeshStandardMaterial} from "three";


class Player extends Mesh {
    constructor(height)
    {
        super();

        this.geometry = new BoxGeometry(2, 5);
        this.material = new MeshStandardMaterial({color: new Color("yellow")});

        this.height = height;
        this.position.y = height / 2;
    }
}

export { Player };