import { Collider, PlaneCollider, SphereCollider } from "../../collider/index";
import { Manifold } from "../../core/manifold";
import { MathUtil } from "../../math/index";

import { CollisionDetector } from "./collision_detector";

export class SpherePlaneCollisionDetector implements CollisionDetector {
    flip: boolean; // wether to flip the colliders

    constructor(flip=false) {
        this.flip = flip;
    }

	detectCollision(colliderA: Collider, colliderB: Collider, manifold: Manifold) {
        const sphere = this.flip ? <SphereCollider>colliderB : <SphereCollider>colliderA;
        const plane = this.flip ? <PlaneCollider>colliderA : <PlaneCollider>colliderB;

        // find the signed distance of sphere's center from plane
        const distance = sphere.center.dot(plane.normal) - plane.d;

        if (MathUtil.abs(distance) < sphere.radius) {
            manifold.hasCollision = true;

            const B = sphere.center.clone().subScaledVector(plane.normal, distance);
            const A = sphere.center.clone().subScaledVector(plane.normal, sphere.radius);

            if (this.flip) {
                manifold.update(B, A);
            } else {
                manifold.update(A, B);
            }
        }
	}
}
