import { MathUtil } from "../math/math";
import { Vec3 } from "../math/vec3";
import { Quaternion } from "../math/quat";


class RigidBody {

	constructor(params) {
		if (!(params instanceof Object)) params = {};

		this.id = MathUtil.generateUUID();
		this.position = new Vec3();
		this.orientation = new Quaternion();
		this.rotation = new Vec3();

		if (params.position !== undefined) this.position.fromArray(params.position);
		if (params.rotation !== undefined) {
			this.rotation.fromArray(params.rotation);
			this.orientation.fromEuler(this.rotation);
		}

		this.force = new Vec3();
		this.linearVelocity = new Vec3();
		this.angularVelocity = new Vec3();

		this.mass = 1;
		this.invMass = 1 / this.mass;
		this.move = params.move;

		this.collider = undefined;
	}

	getPosition() {
		return this.position;
	}

	getQuaternion() {
		return this.orientation;
	}

	addCollider(collider) {
		this.collider = collider;
	}

}

export { RigidBody };
