import { Vec3 } from "../math/vec3";

class RigidBody {

	constructor(params) {
		if (!(params instanceof Object)) params = {};

		this.position = new Vec3();
		if (params.position !== undefined) this.position.fromArray(params.position);

		this.velocity = new Vec3();
		this.force = new Vec3();

		this.mass = 0;
		this.invMass = 0;

		// type: LUCID.SHAPE_SPHERE,
		// size: [1, 1, 1], // size of shape
		// rotation: [0, 0, 90], // start rotation in degree
		// move: true, // dynamic or static
		// density: 1,
		// friction: 0.2,
		// restitution: 0.2,
	}

	getPosition() {
		return this.position;
	}

	getQuaternion() {
		// return 
	}

	temp() {
		this.position.y += 0.1;
	}

}

export { RigidBody };
