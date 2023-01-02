import { Vec3 } from "../math/vec3";
import { Collider } from "./collider";

export class SphereCollider extends Collider {
    constructor(shapeType, config, rigidbody) {
        super(shapeType, config, rigidbody);

        // set radius
        this.radius = rigidbody.scale.x;
        // set center
        this.center = rigidbody.position.clone();
    }

    update(rigidbody) {
        this.center.copy(rigidbody.position);
    }
}
