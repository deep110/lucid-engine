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
	}

	step() {
		// apply gravity force
		for (var i = 0; i < this.rigidbodies.length; i++) {
			var body = this.rigidbodies[i];
			if (body.move) {
				body.force.addScaledVector(this.gravity, body.mass);
			}
		}

		// resolve collisions
		// recalculate the net force on body from other objects

		// update velocity & position
		for (var i = 0; i < this.rigidbodies.length; i++) {
			var body = this.rigidbodies[i];
			if (body.move) {
				body.velocity.addScaledVector(body.force, body.invMass * this.timestep);
				body.position.addScaledVector(body.velocity, world.timestep);

				// reset force
				body.force.reset();
			}
		}
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
