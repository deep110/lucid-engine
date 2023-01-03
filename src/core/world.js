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
			if (body.canMove()) {
				body.force.addScaledVector(this.gravity, body.mass);
			}
		}

		// find collisions using narrow phase
		var collisions = this.__runNarrowPhaseCollisionDetector();

		// solve collisions
		this.__runImpulseSolver(collisions);


		// update velocity & position
		for (var i = 0; i < this.rigidbodies.length; i++) {
			var body = this.rigidbodies[i];
			if (body.canMove()) {
				body.move(this.timestep);
				// reset force
				body.force.reset();
				body.torque.reset();
			}
		}

		// console.log(this.rigidbodies[1])
	}

	setGravity(grArr) {
		this.gravity.fromArray(grArr);
	}

	addRigidbody(bodyParams) {
		let rb = new RigidBody(bodyParams);

		let collider = this.__createCollider(bodyParams, rb);
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

	__runNarrowPhaseCollisionDetector() {
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
					collisions.push(manifold);
				}
			}
		}
		return collisions;
	}

	__runImpulseSolver(collisions) {
		for (var i = 0; i < collisions.length; i++) {
			let manifold = collisions[i];

			let bodyA = manifold.bodyA;
			let bodyB = manifold.bodyB;

			let relVelocity = bodyB.linearVelocity.sub(bodyA.linearVelocity);
			// Relative velocity along the normal
			let contactSpeed = relVelocity.dot(manifold.collisionNormal);

			// only proceed forward if bodies are separating
			if (contactSpeed > 0) {
				continue;
			}
			
			var e = bodyA.restitution * bodyB.restitution;
			var impulseMag = -(1 + e) * contactSpeed / (bodyA.invMass + bodyB.invMass);
			var impulse = manifold.collisionNormal.scale(impulseMag);

			if (bodyA.canMove()) {
				bodyA.linearVelocity.subScaledVector(impulse, bodyA.invMass);
			}
			if (bodyB.canMove()) {
				bodyB.linearVelocity.addScaledVector(impulse, bodyB.invMass);
			}
		}
	}

	__createCollider(config, body) {
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
