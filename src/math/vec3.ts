import { MathUtil } from "./utils";
import { ZERO_THRESHOLD } from "../constants";

export class Vec3 {
	x: number;
	y: number;
	z: number;

	constructor(x?: number, y?: number, z?: number) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}

	set(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	}

	add(a: Vec3) {
		const v = new Vec3();

		v.x = this.x + a.x;
		v.y = this.y + a.y;
		v.z = this.z + a.z;
		return v;
	}

	iadd(v: Vec3) {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		return this;
	}

	sub(a: Vec3) {
		const v = new Vec3();

		v.x = this.x - a.x;
		v.y = this.y - a.y;
		v.z = this.z - a.z;
		return v;
	}

	isub(v: Vec3) {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		return this;
	}

	/**
	 * 
	 * @param {number} s scalar value to multiply
	 * 
	 * Performs operation: vec x = vec v * s
	 * 
	 * @returns Scaled Vector
	 */
	scale(s: number) {
		const v = new Vec3();

		v.x = this.x * s;
		v.y = this.y * s;
		v.z = this.z * s;
		return v;
	}

	iscale(s: number) {
		this.x *= s;
		this.y *= s;
		this.z *= s;
		return this;
	}

	multiply(v: Vec3) {
		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;
		return this;
	}

	addScaledVector(v: Vec3, s: number) {
		this.x += v.x * s;
		this.y += v.y * s;
		this.z += v.z * s;

		return this;
	}

	subScaledVector(v: Vec3, s: number) {
		this.x -= v.x * s;
		this.y -= v.y * s;
		this.z -= v.z * s;

		return this;
	}

	cross(a: Vec3) {
		const x = this.x, y = this.y, z = this.z;

		this.x = y * a.z - z * a.y;
		this.y = z * a.x - x * a.z;
		this.z = x * a.y - y * a.x;

		return this;
	}

	tangent(a: Vec3) {
		const ax = a.x, ay = a.y, az = a.z;

		this.x = ay * ax - az * az;
		this.y = -az * ay - ax * ax;
		this.z = ax * az + ay * ay;

		return this;
	}

	dot(v: Vec3) {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}

	lengthSq() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}

	length() {
		return MathUtil.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	normalize() {
		let len = this.x * this.x + this.y * this.y + this.z * this.z;
		if (len > ZERO_THRESHOLD) {
			len = 1 / MathUtil.sqrt(len);
		}
		this.x *= len;
		this.y *= len;
		this.z *= len;

		return this;
	}

	copy(v: Vec3) {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		return this;
	}

	negate() {
		this.x *= -1;
		this.y *= -1;
		this.z *= -1;
		return this;
	}

	isZero() {
		if (this.x !== 0 || this.y !== 0 || this.z !== 0) return true;

		return false;
	}

	equals(v: Vec3 | number, y?: number, z?: number) {
		if (v instanceof Vec3) {
			return v.x === this.x && v.y === this.y && v.z === this.z;
		} else if (y !== undefined && z !== undefined) {
			return v == this.x && y === this.y && z === this.z;
		}
		return false;
	}

	clone() {
		return new Vec3(this.x, this.y, this.z);
	}

	toString() {
		return "Vec3[" + this.x.toFixed(4) + ", " + this.y.toFixed(4) + ", " + this.z.toFixed(4) + "]";
	}

	toArray(array: number[], offset?: number) {
		if (offset === undefined) offset = 0;

		array[offset] = this.x;
		array[offset + 1] = this.y;
		array[offset + 2] = this.z;
	}

	fromArray(array: number[], offset?: number) {
		if (offset === undefined) offset = 0;

		this.x = array[offset];
		this.y = array[offset + 1];
		this.z = array[offset + 2];
		return this;
	}

	reset() {
		this.x = 0;
		this.y = 0;
		this.z = 0;
	}

}
