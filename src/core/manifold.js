import { Vec3 } from "../math/vec3";

export class Manifold {
    constructor(bodyA, bodyB) {
        this.bodyA = bodyA;
        this.bodyB = bodyB;

        // Furthest point of A into B
        this.maxA = undefined;

        // Furthest point of B into A
        this.maxB = undefined;

        // B - A normalized
        this.normal = undefined;

        // Length of B - A
        this.depth = 0;

        this.hasCollision = false;
    }
}
