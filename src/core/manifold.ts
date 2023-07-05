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

        // Furthest point of A into B
        this.A = undefined;

        // Furthest point of B into A
        this.B = undefined;

        // B - A normalized
        this.collisionNormal = new Vec3();

        // Length of B - A
        this.penetrationDepth = 0;

        this.hasCollision = false;
    }

    update(A: Vec3, B: Vec3) {
        this.A = A;
        this.B = B;

        this.collisionNormal.copy(A).isub(B);

        this.penetrationDepth = this.collisionNormal.length();
        // normalize the collision normal
        this.collisionNormal.iscale(1 / this.penetrationDepth);
    }
}
