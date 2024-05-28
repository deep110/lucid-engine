import { Collider, SphereCollider } from "../../collider/index";
import { Manifold } from "../../core/manifold";
import { Vec3 } from "../../math/index";
import { CollisionDetector } from "./collision_detector";

export class SphereSphereCollisionDetector implements CollisionDetector {
	distance: Vec3;

	constructor() {
		this.distance = new Vec3();
	}

	detectCollision(colliderA: Collider, colliderB: Collider, manifold: Manifold) {
		const sphereA = <SphereCollider>colliderA;
		const sphereB = <SphereCollider>colliderB;

		// distance between their centers should be less than sum of radii
		const rSum = sphereA.radius + sphereB.radius;
		this.distance.copy(sphereB.center).isub(sphereA.center);

		if (this.distance.lengthSq() < rSum * rSum) {
			manifold.hasCollision = true;
			manifold.update(this.distance, rSum - this.distance.length());
		}
	}
}
