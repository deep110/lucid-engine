import { MathUtil } from "./utils";
import { Vec3 } from "./vec3";

export class Quaternion {
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
        if (l < 0.0001) {
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

	multiply(q: Quaternion) {
		let r = new Quaternion();
		return r.multiplyQuaternions(this, q);
	}

	imultiply(q: Quaternion) {
		return this.multiplyQuaternions(this, q);
	}

	multiplyQuaternions(a: Quaternion, b: Quaternion) {
		// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

		const qax = a.x, qay = a.y, qaz = a.z, qaw = a.w;
		const qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;

		this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

		return this;
	}

	multiplyVector(v: Vec3) {
		let result = new Vec3();
		// v' = q^−1 vq
	
		// calculate quat * vector
		const ix = this.w * v.x + this.y * v.z - this.z * v.y;
		const iy = this.w * v.y + this.z * v.x - this.x * v.z;
		const iz = this.w * v.z + this.x * v.y - this.y * v.x;
		const iw = -this.x * v.x - this.y * v.y - this.z * v.z;

		// calculate result * inverse quat
		result.x = ix * this.w + iw * -this.x + iy * -this.z - iz * -this.y;
		result.y = iy * this.w + iw * -this.y + iz * -this.x - ix * -this.z;
		result.z = iz * this.w + iw * -this.z + ix * -this.y - iy * -this.x;

		return result;
	}

	fromEuler(rotation: number[], order: string) {
		const c1 = MathUtil.cos(rotation[0] / 2);
		const c2 = MathUtil.cos(rotation[1] / 2);
		const c3 = MathUtil.cos(rotation[2] / 2);

		const s1 = MathUtil.sin(rotation[0] / 2);
		const s2 = MathUtil.sin(rotation[1] / 2);
		const s3 = MathUtil.sin(rotation[2] / 2);

		switch (order) {
			case 'XYZ':
				this.x = s1 * c2 * c3 + c1 * s2 * s3;
				this.y = c1 * s2 * c3 - s1 * c2 * s3;
				this.z = c1 * c2 * s3 + s1 * s2 * c3;
				this.w = c1 * c2 * c3 - s1 * s2 * s3;
				break;

			case 'YXZ':
				this.x = s1 * c2 * c3 + c1 * s2 * s3;
				this.y = c1 * s2 * c3 - s1 * c2 * s3;
				this.z = c1 * c2 * s3 - s1 * s2 * c3;
				this.w = c1 * c2 * c3 + s1 * s2 * s3;
				break;

			case 'ZXY':
				this.x = s1 * c2 * c3 - c1 * s2 * s3;
				this.y = c1 * s2 * c3 + s1 * c2 * s3;
				this.z = c1 * c2 * s3 + s1 * s2 * c3;
				this.w = c1 * c2 * c3 - s1 * s2 * s3;
				break;

			case 'ZYX':
				this.x = s1 * c2 * c3 - c1 * s2 * s3;
				this.y = c1 * s2 * c3 + s1 * c2 * s3;
				this.z = c1 * c2 * s3 - s1 * s2 * c3;
				this.w = c1 * c2 * c3 + s1 * s2 * s3;
				break;

			case 'YZX':
				this.x = s1 * c2 * c3 + c1 * s2 * s3;
				this.y = c1 * s2 * c3 + s1 * c2 * s3;
				this.z = c1 * c2 * s3 - s1 * s2 * c3;
				this.w = c1 * c2 * c3 - s1 * s2 * s3;
				break;

			case 'XZY':
				this.x = s1 * c2 * c3 - c1 * s2 * s3;
				this.y = c1 * s2 * c3 - s1 * c2 * s3;
				this.z = c1 * c2 * s3 + s1 * s2 * c3;
				this.w = c1 * c2 * c3 + s1 * s2 * s3;
				break;

			default:
				console.warn('LUCID.Quaternion: .fromEuler() encountered an unknown order: ' + order);
		}
		return this;
	}

	fromAxisAngle(axis: Vec3, angle: number) {
		const halfAngle = angle * 0.5;
		const sinHalfAngle = Math.sin(halfAngle);

		this.x = axis.x * sinHalfAngle;
		this.y = axis.y * sinHalfAngle;
		this.z = axis.z * sinHalfAngle;
		this.w = Math.cos(halfAngle);

		return this;
	}
}
