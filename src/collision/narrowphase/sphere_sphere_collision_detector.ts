import { Collider, SphereCollider } from "../../collider/index";
import { Manifold } from "../../core/manifold";

import { CollisionDetector } from "./collision_detector";

export class SphereSphereCollisionDetector implements CollisionDetector {

	detectCollision(colliderA: Collider, colliderB: Collider, manifold: Manifold) {
		const sphereA = <SphereCollider>colliderA;
		const sphereB = <SphereCollider>colliderB;

		// distance between their centers should be less than sum of radii
		let rSum = sphereA.radius + sphereB.radius;
		let dist = sphereB.center.sub(sphereA.center);

		if (dist.lengthSq() < rSum * rSum) {
			manifold.hasCollision = true;

			let normal = dist.normalize();
			let A = sphereA.center.clone().addScaledVector(normal, sphereA.radius);
			let B = sphereB.center.clone().addScaledVector(normal.negate(), sphereA.radius);

			manifold.update(A, B);
		}
	}
}
