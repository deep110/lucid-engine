// import { Vec3 } from "../math/index";
import { Collider } from "./collider";
import { RigidBody } from "../core/rigidbody";

export class BoxCollider extends Collider {

	constructor(shapeType: number, rigidbody: RigidBody) {
		super(shapeType, rigidbody);
	}

}
