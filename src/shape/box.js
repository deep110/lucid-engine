import { Vec3 } from "../math/vec3";
import { Shape } from "./shape";

class Box extends Shape {

	constructor(config) {
		super(config);
	}

	calculateMass() {
		console.log("Box: Mass Info called");
	}

}

export { Box };
