class Shape {

	constructor(config) {

		this.friction = config.friction;
		this.restitution = config.restitution;

	}

	calculateMass() {
		console.error("Shape: Inheritance Error");
	}

}

export { Shape };
