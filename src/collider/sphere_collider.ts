import { Vec3 } from "../math/index";
import { Collider } from "./collider";
import { RigidBody } from "../core/rigidbody";

export class SphereCollider extends Collider {
    radius: number;
    center: Vec3;

    constructor(shapeType: number, rigidbody: RigidBody) {
        super(shapeType, rigidbody);

        // set radius
        this.radius = rigidbody.scale.x;
        // set center
        this.center = rigidbody.position.clone();
    }

    update(rigidbody: RigidBody) {
        this.center.copy(rigidbody.position);
    }
}
