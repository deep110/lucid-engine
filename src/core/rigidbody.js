import { Vec3 } from "../lucid";

class RigidBody {

	constructor() {
		this.position = new Vec3();
		this.velocity = new Vec3();
		this.force = new Vec3();

		this.mass = 0;
		this.invMass = 0;
	}

}

export { RigidBody };
