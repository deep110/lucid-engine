import { RigidBody } from "../core/rigidbody";

export class Collider {
	shape: number;

	constructor(shapeType: number, rigidbody: RigidBody) {
		this.shape = shapeType;
	}

	update(rigidbody: RigidBody) {
		throw new Error("Collider: Update Inheritance Error");
	}
}

