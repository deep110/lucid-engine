import { MathUtil } from "./math";

class Quaternion {

	constructor(x, y, z, w) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		this.w = w || 1;
	}

	set(x, y, z, w) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
		return this;
	}

	length() {
		return MathUtil.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
	}

	lengthSq() {
		return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
	}

	copy(q) {        
		this.x = q.x;
		this.y = q.y;
		this.z = q.z;
		this.w = q.w;
		return this;
	}

	clone() {
		return new Quat(this.x, this.y, this.z, this.w);
	}

	fromEuler(v) {
		this.x = MathUtil.cos(v.z/2) * MathUtil.cos(v.y/2) * MathUtil.sin(v.x/2) - MathUtil.sin(v.z/2) * MathUtil.sin(v.y/2) * MathUtil.cos(v.x/2);
		this.y = MathUtil.cos(v.z/2) * MathUtil.sin(v.y/2) * MathUtil.cos(v.x/2) + MathUtil.sin(v.z/2) * MathUtil.cos(v.y/2) * MathUtil.sin(v.x/2);
		this.z = MathUtil.sin(v.z/2) * MathUtil.cos(v.y/2) * MathUtil.cos(v.x/2) - MathUtil.cos(v.z/2) * MathUtil.sin(v.y/2) * MathUtil.sin(v.x/2);
		this.w = MathUtil.cos(v.z/2) * MathUtil.cos(v.y/2) * MathUtil.cos(v.x/2) + MathUtil.sin(v.z/2) * MathUtil.sin(v.y/2) * MathUtil.sin(v.x/2);
	}
}

export { Quaternion };
