import { MathUtil } from "../../math/math";
import { CollisionDetector } from "./collision_detector";

export class SpherePlaneCollisionDetector extends CollisionDetector {

    constructor(flip=false) {
        super();
        this.flip = flip;
    }

	detectCollision(colliderA, colliderB, manifold) {
        var sphere = this.flip ? colliderB : colliderA;
        var plane = this.flip ? colliderA : colliderB;

        // find the signed distance of sphere's center from plane
        var distance = sphere.center.dot(plane.normal) - plane.d;

        if (MathUtil.abs(distance) < sphere.radius) {
            manifold.hasCollision = true;

            var B = sphere.center.clone().subScaledVector(plane.normal, distance);
            var A = sphere.center.clone().subScaledVector(plane.normal, sphere.radius);

            if (this.flip) {
                manifold.update(B, A);
            } else {
                manifold.update(A, B);
            }
        }
	}
}
