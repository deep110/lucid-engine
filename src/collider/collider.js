class Collider {

	constructor(shape, config) {
		this.shape = shape;

		this.density = config.density || 1;
		this.friction = config.friction || 0.2;
		this.restitution = config.restitution || 0.6;

	}

}

export { Collider };
