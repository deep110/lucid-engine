import { RigidBody } from "./rigidbody";
import { Vec3 } from "../math/vec3";
import { SHAPE_BOX, SHAPE_SPHERE, SHAPE_PLANE, BODY_DYNAMIC } from "../constants";

import { BoxCollider } from "../collider/box_collider";
import { SphereCollider } from "../collider/sphere_collider";
import { PlaneCollider } from "../collider/plane_collider";

import { SphereSphereCollisionDetector } from "../collision/narrowphase/sphere_sphere_collision_detector";
import { SpherePlaneCollisionDetector } from "../collision/narrowphase/sphere_plane_collision_detector";
import { Manifold } from "./manifold";

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

		this.detector = [{}, {}, {}, {}, {}];
		this.detector[SHAPE_SPHERE][SHAPE_SPHERE] = new SphereSphereCollisionDetector();
		this.detector[SHAPE_SPHERE][SHAPE_PLANE] = new SpherePlaneCollisionDetector();
		this.detector[SHAPE_PLANE][SHAPE_SPHERE] = new SpherePlaneCollisionDetector(true);
	}

	step() {
		// apply gravity force
		for (var i = 0; i < this.rigidbodies.length; i++) {
			var body = this.rigidbodies[i];
			if (body.type == BODY_DYNAMIC && body.invMass > 0) {
				body.force.addScaledVector(this.gravity, body.mass);
			}
		}

		// resolve collisions
		this.resolveCollisions();

		// update velocity & position
		for (var i = 0; i < this.rigidbodies.length; i++) {
			var body = this.rigidbodies[i];
			if (body.type == BODY_DYNAMIC && body.invMass > 0) {
				body.move(this.timestep);
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

		let collider = this._createCollider(bodyParams, rb);
		if (collider == undefined) {
			console.error("Collider of shape: ", bodyParams.shape, " cannot be created");
			return;
		}
		rb.addCollider(collider);

		this.rigidbodies.push(rb);
		return rb;
	}

	removeRigidbody() {
	}

	getNumRigidbodies() {
		return this.rigidbodies.length;
	}

	resolveCollisions() {
		var numBodies = this.rigidbodies.length;
		var collisions = [];

		for (var i = 0; i < numBodies; i++) {
			for (var j = i+1; j < numBodies; j++) {
				var bodyA = this.rigidbodies[i];
				var bodyB = this.rigidbodies[j];

				var detector = this.detector[bodyA.collider.shape][bodyB.collider.shape];
				var manifold = new Manifold(bodyA, bodyB);

				detector.detectCollision(bodyA.collider, bodyB.collider, manifold);
				if (manifold.hasCollision) {
					console.log("Collision Detected: ", manifold);
					collisions.push(manifold);
				}
			}
		}

		// solve collisions

		// impulse solver
		// position correction
	}

	_createCollider(config, body) {
		switch (config.shape) {
			case SHAPE_BOX:
				return new BoxCollider(SHAPE_BOX, config, body);
			case SHAPE_SPHERE:
				return new SphereCollider(SHAPE_SPHERE, config, body);
			case SHAPE_PLANE:
				return new PlaneCollider(SHAPE_PLANE, config, body);
		}
	}

}

export { World };
