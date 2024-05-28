import { Vec3 } from "../math/index";
import { RigidBody } from "./rigidbody";

export class Manifold {
    bodyA: RigidBody;
    bodyB: RigidBody;
    A?: Vec3;
    B?: Vec3;
    collisionNormal: Vec3;
    penetrationDepth: number;
    hasCollision: boolean;

    constructor(bodyA: RigidBody, bodyB: RigidBody) {
        this.bodyA = bodyA;
        this.bodyB = bodyB;

        // collision direction
        this.collisionNormal = new Vec3();
        this.penetrationDepth = 0;

        this.hasCollision = false;
    }

    update(collisionNormal: Vec3, penetrationDepth: number) {
        this.collisionNormal.copy(collisionNormal);
        this.penetrationDepth = penetrationDepth;

        // normalize the collision normal
        this.collisionNormal.normalize();
    }
}
