import { CollisionDetector } from "./collision_detector";

export class SpherePlaneCollisionDetector extends CollisionDetector {

    constructor(flip=false) {
        super();
        this.flip = flip;
    }

	detectCollision(colliderA, colliderB, manifold) {
        
	}
}
