import { Vec3 } from "../math/vec3";

export class Manifold {
    constructor(bodyA, bodyB) {
        this.bodyA = bodyA;
        this.bodyB = bodyB;

        // Furthest point of A into B
        this.A = undefined;

        // Furthest point of B into A
        this.B = undefined;

        // B - A normalized
        this.collisionNormal = undefined;

        // Length of B - A
        this.penetrationDepth = 0;

        this.hasCollision = false;
    }

    update(A, B) {
        this.A = A;
        this.B = B;

        var normal = A.sub(B);

        this.penetrationDepth = normal.length();
        this.collisionNormal = normal.normalize();
    }
}
