import { Mat33, Quaternion, Vec3 } from "../math/index";
import { Collider } from "./collider";
import { RigidBody } from "../core/rigidbody";

export class BoxCollider extends Collider {
	half_extents: Vec3; // contains half length, width and depth
	center: Vec3;
	orientation: Quaternion;

	constructor(shapeType: number, rigidbody: RigidBody) {
		super(shapeType, rigidbody);

		this.center = rigidbody.position.clone();
		this.half_extents = rigidbody.scale.scale(0.5);
		this.orientation = rigidbody.rotation.clone();
	}

	calculateMassInfo(mass: number, inertia: Mat33) {
		const p = mass / 3;
		inertia.diagonal(
			p * (this.half_extents.y * this.half_extents.y + this.half_extents.z * this.half_extents.z),
			p * (this.half_extents.x * this.half_extents.x + this.half_extents.z * this.half_extents.z),
			p * (this.half_extents.x * this.half_extents.x + this.half_extents.y * this.half_extents.y),
		);
	}

	update(rigidbody: RigidBody): void {
        this.center.copy(rigidbody.position);
		this.orientation.copy(rigidbody.rotation);
    }
}
