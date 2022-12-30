import { RigidBody } from "./rigidbody";
import { Vec3 } from "../math/vec3";

class World {
	constructor(params) {
		if (!(params instanceof Object)) params = {};

		this.timestep = params.timestep || 1 / 60;
		this.iterations = params.iterations || 8;

		this.scale = params.worldscale || 1;
		this.invScale = 1 / this.scale;

		// set gravity
		this.gravity = new Vec3(0, -9.8, 0);
		if (params.gravity !== undefined) this.gravity.fromArray(params.gravity);

		this.rigidbodies = [];
		this.numRigidbodies = 0;
	}

	step() {
		this.rigidbodies[0].temp();
	}

	setGravity(grArr) {
		this.gravity.fromArray(grArr);
	}

	addRigidbody(bodyParams) {
		let rb = new RigidBody(bodyParams);
		if (rb.shape == undefined) {
			console.error("Rigidbody of shape: ", bodyParams.shape, " cannot be created");
			return;
		}
		this.rigidbodies.push(rb);

		return rb;
	}

	removeRigidbody() {

	}

	getNumRigidbodies() {
		return this.rigidbodies.length;
	}

}

export { World };
