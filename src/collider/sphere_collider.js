import { Collider } from "./collider";

export class SphereCollider extends Collider {
    constructor(shape, config) {
        super(shape, config);

        // this.radius = config.scale;
    }
}
