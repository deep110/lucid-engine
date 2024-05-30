import { Collider, SphereCollider } from "../../collider/index";
import { EPSILON } from "../../constants";
import { Manifold } from "../../core/manifold";
import { MathUtil, Vec3 } from "../../math/index";
import { CollisionDetector } from "./collision_detector";

export class SphereSphereCollisionDetector implements CollisionDetector {
	distance: Vec3;
	zeroNormal: Vec3;

	constructor() {
		this.distance = new Vec3();
		this.zeroNormal = new Vec3(0, 1, 0);
	}

	detectCollision(colliderA: Collider, colliderB: Collider, manifold: Manifold) {
		const sphereA = <SphereCollider>colliderA;
		const sphereB = <SphereCollider>colliderB;

		// distance between their centers should be less than sum of radii
		const rSum = sphereA.radius + sphereB.radius;
		this.distance.copy(sphereB.center).isub(sphereA.center);
		const distanceSq = this.distance.lengthSq();

		if (distanceSq < rSum * rSum) {
			manifold.hasCollision = true;
			if (distanceSq > EPSILON) {
				manifold.update(this.distance, rSum - MathUtil.sqrt(distanceSq));
			} else {
				// handle case when distance is almost zero or close to zero
				manifold.update(this.zeroNormal, Math.min(sphereA.radius, sphereB.radius));
			}
		}
	}
}
