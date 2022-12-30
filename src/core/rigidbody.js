import { MathUtil } from "../math/math";
import { Vec3 } from "../math/vec3";
import { SHAPE_BOX } from "../constants"
import { Box } from "../shape/box";

class RigidBody {

	constructor(params) {
		if (!(params instanceof Object)) params = {};

		this.id = MathUtil.generateUUID();

		this.position = new Vec3();
		if (params.position !== undefined) this.position.fromArray(params.position);

		this.velocity = new Vec3();
		this.force = new Vec3();

		this.shape = this.createShape(params.type, {
			friction: params.friction || 0.2,
			restitution: params.restitution || 0.2,
		});

		this.mass = 0;
		this.invMass = 0;

		// size: [1, 1, 1], // size of shape
		// rotation: [0, 0, 90], // start rotation in degree
		// move: true, // dynamic or static
		// density: 1,
	}

	getPosition() {
		return this.position;
	}

	getQuaternion() {
		// return 
	}

	createShape(type, config) {
		switch (type) {
			case SHAPE_BOX:
				return new Box(config);
		}
	}

	temp() {
		this.position.y += 0.1;
	}

}

export { RigidBody };
