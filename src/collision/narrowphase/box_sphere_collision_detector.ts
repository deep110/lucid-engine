import { BoxCollider, Collider, SphereCollider } from "../../collider/index";
import { Manifold } from "../../core/manifold";
import { Quaternion, Vec3 } from "../../math/index";
import { CollisionDetector } from "./collision_detector";

export class BoxSphereCollisionDetector implements CollisionDetector {
	flip: boolean; // wether to flip the colliders
    sphCenter: Vec3; // transformed sphere's center
    cuboidPoint: Vec3; // transformed point on cuboid nearest to sphere's center
    normal: Vec3; // final normal vector
    boxOrientationConj: Quaternion;

    constructor(flip=false) {
        this.flip = flip;
        this.sphCenter = new Vec3();
        this.cuboidPoint = new Vec3();
        this.normal = new Vec3();
        this.boxOrientationConj = new Quaternion();
    }

	detectCollision(colliderA: Collider, colliderB: Collider, manifold: Manifold) {
        const box = this.flip ? <BoxCollider>colliderB : <BoxCollider>colliderA;
        const sphere = this.flip ? <SphereCollider>colliderA : <SphereCollider>colliderB;

        // transform sphere's center to box's local coordinate system
        this.sphCenter.copy(sphere.center).isub(box.center);
        if (box.orientation.w != 1.0) {
            box.orientation.multiplyVector(this.sphCenter, this.sphCenter);
        }

        // Calculate the closest point on the cuboid to the sphere center
        // It will be sphere's center if sphere's center is inside the cuboid
        this.cuboidPoint.x = Math.max(-box.half_extents.x, Math.min(this.sphCenter.x, box.half_extents.x));
        this.cuboidPoint.y = Math.max(-box.half_extents.y, Math.min(this.sphCenter.y, box.half_extents.y));
        this.cuboidPoint.z = Math.max(-box.half_extents.z, Math.min(this.sphCenter.z, box.half_extents.z));

        let distanceV = this.sphCenter.isub(this.cuboidPoint);
        const distanceSq = distanceV.lengthSq();

        if (distanceSq < sphere.radiusSq) {
            manifold.hasCollision = true;

            // handle special case when sphere's center is inside the box
            if (distanceSq == 0) {
                // we can take normal direction to be vector between two centers
                this.normal.copy(sphere.center).isub(box.center);
            } else {
                // inverse transform this cuboid point
                if (box.orientation.w != 1.0) {
                    this.boxOrientationConj.copy(box.orientation).conjugate().multiplyVector(this.cuboidPoint, this.cuboidPoint);
                }
                this.cuboidPoint.iadd(box.center);
                this.normal.copy(sphere.center).isub(this.cuboidPoint);
            }

            if (this.flip) {
                manifold.update(this.normal.iscale(-1), sphere.radius - Math.sqrt(distanceSq))
            } else {
                manifold.update(this.normal, sphere.radius - Math.sqrt(distanceSq))
            }
        }
	}
}
