import { MathUtil, Vec3, Quaternion, Mat33 } from "../math/index";
import { BODY_DYNAMIC, BODY_STATIC, ZERO_THRESHOLD } from "../constants";
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
	mass: number | undefined;
};


export class RigidBody {
	id: string;
	type: number;

	// transform properties
	position: Vec3;
	rotation: Quaternion;
	scale: Vec3;

	// kinematics
	mass: number; invMass: number;
	invInertia: Mat33;
	netForce: Vec3;
	netTorque: Vec3;
	linearVelocity: Vec3;
	angularVelocity: Vec3;

	// material
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

		this.netForce = new Vec3();
		this.netTorque = new Vec3();
		this.linearVelocity = new Vec3();
		this.angularVelocity = new Vec3();

		this.type = params.type || BODY_DYNAMIC;
		this.mass = params.mass || 1.0;
		this.invMass = 1 / this.mass;
		this.invInertia = new Mat33();

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

	getScale() {
		return this.scale;
	}

	addCollider(collider: Collider) {
		this.collider = collider;

		this.calculateMassInfo();
	}

	canMove() {
		return this.type == BODY_DYNAMIC && this.invMass > 0;
	}

	applyForce(force: Vec3, point?: Vec3) {
		if (!this.canMove()) {
			return;
		}

		this.netForce.addScaledVector(force, this.mass);

		// if point is passed, then force might not be getting applied on COM
		// this will also give rise to `Torque = F x r`
		if (point) {
			let r = point.sub(this.position);
			this.netTorque.iadd(r.cross(force));
		}
	}

	applyImpulse(impulse: Vec3) {
		if (this.canMove()) {
			this.linearVelocity.addScaledVector(impulse, this.invMass);
			// this.angularVelocity.iadd(this.invInertia.multiplyVector(impulse));
			// console.log("Im: ",this.invInertia.multiplyVector(impulse));
		}
	}

	move(dt: number) {
		if (!this.canMove()) {
			return;
		}

		// integrate velocity
		// F = m dv / dt
		this.linearVelocity.addScaledVector(this.netForce, this.invMass * dt);
		this.angularVelocity.addScaledVector(this.invInertia.multiplyVector(this.netTorque), dt);

		// TODO: add linear and angular damping because of air friction
		this.angularVelocity.iscale(0.9);

		// integrate position and rotation
		this.position.addScaledVector(this.linearVelocity, dt);
		const halfAngle = this.angularVelocity.length() * 0.5;
		if (halfAngle > ZERO_THRESHOLD) {
			const rotationAxis = this.angularVelocity.clone().normalize();
			this.rotation.imultiply(new Quaternion().fromAxisAngle(rotationAxis, halfAngle));
			this.rotation.normalize();
		}

		// update collider
		this.collider?.update(this);
	}

	private calculateMassInfo() {
		if (this.type == BODY_STATIC) {
			this.invMass = 0;
			this.mass = 0;
			this.invInertia.set(0, 0, 0, 0, 0, 0, 0, 0, 0);

			return;
		}

		// set the initial inertia of the model
		this.collider?.calculateMassInfo(this.mass, this.invInertia);
		// invert the inertia
		this.invInertia.invert();
	}
}
