import { SHAPE_BOX, SHAPE_SPHERE, PENETRATION_ALLOWANCE } from "../constants";
import { MathUtil, Vec3 } from "../math/index";

import { RigidBody, RigidbodyParams } from "./rigidbody";
import { Manifold } from "./manifold";
import { BoxCollider, SphereCollider } from "../collider/index";

import { NarrowPhaseSolver } from "../collision/narrowphase/index";


export class World {
	timestep: number;
	iterations: number;
	gravity: Vec3;
	linear_damping: number;
	angular_damping: number;
	
	rigidbodies: RigidBody[];
	narrow_phase_solver: any;

	constructor(params: any) {
		if (!(params instanceof Object)) params = {};

		this.timestep = params.timestep || 1 / 60;
		this.iterations = params.iterations || 8;

		// set gravity
		this.gravity = new Vec3(0, -9.8, 0);
		if (params.gravity !== undefined) this.gravity.fromArray(params.gravity);
		this.linear_damping = params.linear_damping || 1;
		this.angular_damping = params.angular_damping || 0.9;

		this.rigidbodies = [];
		this.narrow_phase_solver = new NarrowPhaseSolver();
	}

	step() {
		// find collisions using narrow phase
		const collisions = this.narrow_phase_solver.solve(this.rigidbodies);

		// solve collisions
		this.runImpulseSolver(collisions);
		this.runPositionCorrectionSolver(collisions);

		for (let i = 0; i < this.rigidbodies.length; i++) {
			const body = this.rigidbodies[i];

			// calculate net force on body, right now it is just gravity
			body.applyForce(this.gravity);

			// move the body due to force or impulse during collision
			body.move(this.timestep, this.linear_damping, this.angular_damping);

			// reset force
			body.reset_force();
		}
	}

	setGravity(grArr: number[]) {
		this.gravity.fromArray(grArr);
	}

	addRigidbody(bodyParams: RigidbodyParams) {
		const rb = new RigidBody(bodyParams);

		const collider = this.createCollider(bodyParams.shape, rb);
		if (collider == undefined) {
			console.error("Collider of shape: ", bodyParams.shape, " cannot be created");
			return;
		}
		rb.addCollider(collider);

		this.rigidbodies.push(rb);
		return rb;
	}

	removeRigidbody(rb: RigidBody) {
	}

	clear() {
		this.rigidbodies = [];
	}

	getNumRigidbodies() {
		return this.rigidbodies.length;
	}

	private runImpulseSolver(collisions: Manifold[]) {
		for (let i = 0; i < collisions.length; i++) {
			const manifold = collisions[i];

			const bodyA = manifold.bodyA;
			const bodyB = manifold.bodyB;

			const relVelocity = bodyB.linearVelocity.sub(bodyA.linearVelocity);
			// Relative velocity along the normal
			let contactSpeed = relVelocity.dot(manifold.collisionNormal);

			// only proceed forward if bodies are separating
			if (contactSpeed > 0) {
				continue;
			}

			// Normal Impulse

			const e = bodyA.restitution * bodyB.restitution;
			const totalInvMass = bodyA.invMass + bodyB.invMass;

			const impulseMag = -(1 + e) * contactSpeed / totalInvMass;
			const impulse = manifold.collisionNormal.scale(impulseMag);

			bodyB.applyImpulse(impulse);
			bodyA.applyImpulse(impulse.negate());

			// Frictional Impulse

			relVelocity.copy(bodyB.linearVelocity).isub(bodyA.linearVelocity);
			contactSpeed = relVelocity.dot(manifold.collisionNormal);

			// get direction of relative velocity perpendicular to collision normal
			const tangent = relVelocity.clone().subScaledVector(manifold.collisionNormal, contactSpeed);
			tangent.normalize();

			let mu = MathUtil.sqrt(
				bodyA.staticFriction * bodyA.staticFriction + bodyB.staticFriction * bodyB.staticFriction
			);
			const frictionImpulseMag = -relVelocity.dot(tangent) / totalInvMass;
			
			// Coulomb's Law:  F <= μFn
			//
			// use static friction if friction force less than Normal force
			if (MathUtil.abs(frictionImpulseMag) < impulseMag * mu) {
				impulse.copy(tangent).iscale(frictionImpulseMag);
			} else {
				mu = MathUtil.sqrt(
					bodyA.dynamicFriction * bodyA.dynamicFriction + bodyB.dynamicFriction * bodyB.dynamicFriction
				);
				impulse.copy(tangent).iscale(-impulseMag * mu);
			}

			bodyB.applyImpulse(impulse);
			bodyA.applyImpulse(impulse.negate());
		}
	}

	/**
	 * This is required to prevent rigidbodies from passing each other.
	 * Impulse resolution does change the velocity but still position needs to be forcefully
	 * updated to separate out the colliding bodies
	 *
	 * @param collisions pairs of colliding rigidbodies
	 */
	private runPositionCorrectionSolver(collisions: Manifold[]) {
		for (let i = 0; i < collisions.length; i++) {
			const manifold = collisions[i];

			const bodyA = manifold.bodyA;
			const bodyB = manifold.bodyB;

			const correction = MathUtil.max(0, manifold.penetrationDepth - PENETRATION_ALLOWANCE) * 0.8
				/ (bodyA.invMass + bodyB.invMass);

			if (bodyA.canMove()) {
				bodyA.position.subScaledVector(manifold.collisionNormal, bodyA.invMass * correction);
			}
			if (bodyB.canMove()) {
				bodyB.position.addScaledVector(manifold.collisionNormal, bodyB.invMass * correction);
			}
		}
	}

	private createCollider(shape: number, body: RigidBody) {
		switch (shape) {
			case SHAPE_BOX:
				return new BoxCollider(SHAPE_BOX, body);
			case SHAPE_SPHERE:
				return new SphereCollider(SHAPE_SPHERE, body);
		}
	}
}
