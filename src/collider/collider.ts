import { RigidBody } from "../core/rigidbody";
import { Mat33 } from "../math/mat33";

export class Collider {
	shape: number;

	constructor(shapeType: number, rigidbody: RigidBody) {
		this.shape = shapeType;
	}

	calculateMassInfo(mass: number, inertia: Mat33) {
		throw new Error("Collider: calculateMassInfo - Inheritance Error");
	}

	update(rigidbody: RigidBody) {
		throw new Error("Collider: Update - Inheritance Error");
	}
}

