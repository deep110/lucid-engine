class Collider {

	constructor(shapeType, config, rigidbody) {
		this.shape = shapeType;

		this.density = config.density || 1;
		this.friction = config.friction || 0.2;
		this.restitution = config.restitution || 0.6;

	}

	update(rigidbody) {
		throw new Error("Collider: Update Inheritance Error");
	}
}

export { Collider };
