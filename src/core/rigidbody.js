import { MathUtil } from "../math/math";
import { Vec3 } from "../math/vec3";
import { SHAPE_BOX } from "../constants";
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
			density: params.density || 1,
		});

		this.mass = (this.shape) ? this.shape.calculateMass() : 0;
		this.invMass = 1 / this.mass;

		this.move = params.move;

		// rotation: [0, 0, 90], // start rotation in degree
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
}

export { RigidBody };
