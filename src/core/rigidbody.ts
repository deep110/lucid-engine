import { MathUtil, Vec3, Quaternion } from "../math/index";
import { BODY_DYNAMIC, BODY_STATIC } from "../constants";
import { Collider } from "../collider/index";


export type RigidbodyParams = {
	type: number;
	shape: number;
	position: number[] | undefined;
	rotation: number[] | undefined;
	scale: number[] | undefined;
	rotationOrder: string | undefined;
	restitution: number | undefined;
	staticFriction: number | undefined;
	dynamicFriction: number | undefined;
	density: number | undefined;
};


export class RigidBody {
	id: string;
	type: number;

	// transform properties
	position: Vec3;
	rotation: Quaternion;
	scale: Vec3;

	// kinematics
	mass: number;
	invMass: number;
	force: Vec3;
	torque: Vec3;
	linearVelocity: Vec3;
	angularVelocity: Vec3;

	// material
	density: number;
	restitution: number;
	staticFriction: number;
	dynamicFriction: number;

	// collider
	collider?: Collider;

	constructor(params: RigidbodyParams) {
		this.id = MathUtil.generateUUID();
		this.position = new Vec3();
		this.rotation = new Quaternion();
		this.scale = new Vec3(1, 1, 1);

		if (params.position !== undefined) this.position.fromArray(params.position);
		if (params.rotation !== undefined) {
			let order = params.rotationOrder || "XYZ";
			this.rotation.fromEuler(params.rotation, order);
		}
		if (params.scale !== undefined) this.scale.fromArray(params.scale);

		this.force = new Vec3();
		this.torque = new Vec3();
		this.linearVelocity = new Vec3();
		this.angularVelocity = new Vec3();

		this.type = params.type || BODY_DYNAMIC;
		this.mass = 1;
		this.invMass = 1 / this.mass;

		if (this.type == BODY_STATIC) {
			this.mass = MathUtil.INF;
			this.invMass = 0;
		}

		this.density = params.density || 1;
		this.restitution = params.restitution || 0.8;
		this.staticFriction = params.staticFriction || 0.3;
		this.dynamicFriction = params.dynamicFriction || 0.1;
	}

	getPosition() {
		return this.position;
	}

	getQuaternion() {
		return this.rotation;
	}

	addCollider(collider: Collider) {
		this.collider = collider;
	}

	canMove() {
		return this.type == BODY_DYNAMIC && this.invMass > 0;
	}

	move(dt: number) {
		if (!this.canMove()) {
			return;
		}

		this.linearVelocity.addScaledVector(this.force, this.invMass * dt);
		this.position.addScaledVector(this.linearVelocity, dt);
		// TODO: account for rotation

		// update collider
		if (this.collider) this.collider.update(this);
	}

	applyImpulse(impulse: Vec3) {
		if (this.canMove()) {
			this.linearVelocity.addScaledVector(impulse, this.invMass);
		}
	}
}
