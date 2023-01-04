import { MathUtil } from "./utils";
import { Vec3 } from "./vec3";

class Quaternion {
	x: number;
	y: number;
	z: number;
	w: number;

	constructor(x?: number, y?: number, z?: number, w?: number) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		this.w = w || 1;
	}

	set(x: number, y: number, z: number, w: number) {
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

	copy(q: Quaternion) {        
		this.x = q.x;
		this.y = q.y;
		this.z = q.z;
		this.w = q.w;
		return this;
	}

	clone() {
		return new Quaternion(this.x, this.y, this.z, this.w);
	}

	normalize() {
        let l = this.length();
        if (l === 0) {
            this.set(0, 0, 0, 1);
        } else {
            l = 1 / l;
            this.x = this.x * l;
            this.y = this.y * l;
            this.z = this.z * l;
            this.w = this.w * l;
        }
        return this;
    }

	conjugate() {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;
        return this;
    }

	inverse() {
        return this.conjugate().normalize();
    }

	fromEuler(v: Vec3) {
		this.x = MathUtil.cos(v.z/2) * MathUtil.cos(v.y/2) * MathUtil.sin(v.x/2) - MathUtil.sin(v.z/2) * MathUtil.sin(v.y/2) * MathUtil.cos(v.x/2);
		this.y = MathUtil.cos(v.z/2) * MathUtil.sin(v.y/2) * MathUtil.cos(v.x/2) + MathUtil.sin(v.z/2) * MathUtil.cos(v.y/2) * MathUtil.sin(v.x/2);
		this.z = MathUtil.sin(v.z/2) * MathUtil.cos(v.y/2) * MathUtil.cos(v.x/2) - MathUtil.cos(v.z/2) * MathUtil.sin(v.y/2) * MathUtil.sin(v.x/2);
		this.w = MathUtil.cos(v.z/2) * MathUtil.cos(v.y/2) * MathUtil.cos(v.x/2) + MathUtil.sin(v.z/2) * MathUtil.sin(v.y/2) * MathUtil.sin(v.x/2);
	}
}

export { Quaternion };
