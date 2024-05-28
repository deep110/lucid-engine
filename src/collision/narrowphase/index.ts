import { BoxBoxCollisionDetector } from "./box_box_collision_detector";
import { SphereSphereCollisionDetector } from "./sphere_sphere_collision_detector";
import { BoxSphereCollisionDetector } from "./box_sphere_collision_detector";
import { SHAPE_SPHERE, SHAPE_BOX } from "../../constants";
import { RigidBody } from "../../core/rigidbody";
import { Manifold } from "../../core/manifold";


export class NarrowPhaseSolver {
    shape_matrix: any;

    constructor() {
        this.shape_matrix = [{}, {}, {}, {}, {}];
		this.shape_matrix[SHAPE_SPHERE][SHAPE_SPHERE] = new SphereSphereCollisionDetector();
		this.shape_matrix[SHAPE_SPHERE][SHAPE_BOX] = new BoxSphereCollisionDetector(true);
		this.shape_matrix[SHAPE_BOX][SHAPE_SPHERE] = new BoxSphereCollisionDetector();
		this.shape_matrix[SHAPE_BOX][SHAPE_BOX] = new BoxBoxCollisionDetector();
    }

    solve(rigidbodies: RigidBody[]) {
		const numBodies = rigidbodies.length;
		const collisions = [];

		for (let i = 0; i < numBodies; i++) {
			for (let j = i+1; j < numBodies; j++) {
				const bodyA = rigidbodies[i];
				const bodyB = rigidbodies[j];

				if (bodyA.collider && bodyB.collider) {
					const detector = this.shape_matrix[bodyA.collider.shape][bodyB.collider.shape];
					const manifold = new Manifold(bodyA, bodyB);
	
					detector.detectCollision(bodyA.collider, bodyB.collider, manifold);
					if (manifold.hasCollision) {
						collisions.push(manifold);
					}
				}
			}
		}
		return collisions;
	}
}
