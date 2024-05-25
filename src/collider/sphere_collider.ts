import { Mat33, Vec3 } from "../math/index";
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

    calculateMassInfo(mass: number, inertia: Mat33): void {
        // moment of inertia of a sphere = 2 / 5 MR^2
        let inertiaValue = mass * this.radius * this.radius * 0.4;

		inertia.diagonal(inertiaValue, inertiaValue, inertiaValue);
    }

    update(rigidbody: RigidBody): void {
        this.center.copy(rigidbody.position);
    }
}
