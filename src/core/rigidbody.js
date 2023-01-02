import { MathUtil } from "../math/math";
import { Vec3 } from "../math/vec3";
import { Quaternion } from "../math/quat";
import { BODY_DYNAMIC } from "../constants";


class RigidBody {

	constructor(params) {
		if (!(params instanceof Object)) params = {};

		this.id = MathUtil.generateUUID();
		this.position = new Vec3();
		this.orientation = new Quaternion();
		this.rotation = new Vec3();
		this.scale = new Vec3(1, 1, 1);

		if (params.position !== undefined) this.position.fromArray(params.position);
		if (params.rotation !== undefined) {
			this.rotation.fromArray(params.rotation);
			this.orientation.fromEuler(this.rotation);
		}
		if (params.scale !== undefined) this.scale.fromArray(params.scale);

		this.force = new Vec3();
		this.linearVelocity = new Vec3();
		this.angularVelocity = new Vec3();

		this.type = params.type || BODY_DYNAMIC;
		this.mass = 1;
		this.invMass = 1 / this.mass;

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

	move(dt) {
		this.linearVelocity.addScaledVector(this.force, this.invMass * dt);
		this.position.addScaledVector(this.linearVelocity, dt);

		// update collider
		this.collider.update(this);
	}

}

export { RigidBody };
