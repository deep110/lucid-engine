import { Collider } from "../../collider/index";
import { Manifold } from "../../core/manifold";

export interface CollisionDetector {
	detectCollision(colliderA: Collider, colliderB: Collider, manifold: Manifold): void ;
}
