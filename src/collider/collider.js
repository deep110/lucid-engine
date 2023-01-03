class Collider {

	constructor(shapeType, config, rigidbody) {
		this.shape = shapeType;

		this.density = config.density || 1;
	}

	update(rigidbody) {
		throw new Error("Collider: Update Inheritance Error");
	}
}

export { Collider };
