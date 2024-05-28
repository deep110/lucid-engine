import { Quaternion } from "./quat";
import { Vec3 } from "./vec3";

export class Mat33 {
    elements: number[];

    constructor() {
        this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    }

    set(
        e00: number, e01: number, e02: number,
        e10: number, e11: number, e12: number,
        e20: number, e21: number, e22: number
    ) {
        const te = this.elements;
        te[0] = e00; te[1] = e01; te[2] = e02;
        te[3] = e10; te[4] = e11; te[5] = e12;
        te[6] = e20; te[7] = e21; te[8] = e22;

        return this;
    }

    diagonal(a: number, b: number, c: number) {
        this.elements[0] = a;
        this.elements[4] = b;
        this.elements[8] = c;
    }

    invert() {
        const tm = this.elements;
        let a00 = tm[0], a10 = tm[3], a20 = tm[6],
        a01 = tm[1], a11 = tm[4], a21 = tm[7],
        a02 = tm[2], a12 = tm[5], a22 = tm[8],
        b01 = a22 * a11 - a12 * a21,
        b11 = -a22 * a10 + a12 * a20,
        b21 = a21 * a10 - a11 * a20,
        det = a00 * b01 + a01 * b11 + a02 * b21;

        if (det === 0) {
            return this.identity();
        }

        det = 1.0 / det;
        tm[0] = b01 * det;
        tm[1] = (-a22 * a01 + a02 * a21) * det;
        tm[2] = (a12 * a01 - a02 * a11) * det;
        tm[3] = b11 * det;
        tm[4] = (a22 * a00 - a02 * a20) * det;
        tm[5] = (-a12 * a00 + a02 * a10) * det;
        tm[6] = b21 * det;
        tm[7] = (-a21 * a00 + a01 * a20) * det;
        tm[8] = (a11 * a00 - a01 * a10) * det;

        return this;
    }

    identity() {
        this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
        return this;
    }

    determinant() {
        const te = this.elements;

        return te[0] * te[4] * te[8] - te[0] * te[5] * te[7] - te[1] * te[3] * te[8] + te[1] * te[5] * te[6] 
            + te[2] * te[3] * te[7] - te[2] * te[4] * te[6];
    }

    multiplyVector(v: Vec3) {
        const result = new Vec3();
        result.x = v.x * this.elements[0] + v.y * this.elements[3] + v.z * this.elements[6];
        result.y = v.x * this.elements[1] + v.y * this.elements[4] + v.z * this.elements[7];
        result.z = v.x * this.elements[2] + v.y * this.elements[5] + v.z * this.elements[8];
        return result;
    }


    fromQuat(q: Quaternion) {
        const x2 = q.x + q.x;
        const y2 = q.y + q.y;
        const z2 = q.z + q.z;

        const xx = q.x * x2;
        const yx = q.y * x2;
        const yy = q.y * y2;
        const zx = q.z * x2;
        const zy = q.z * y2;
        const zz = q.z * z2;
        const wx = q.w * x2;
        const wy = q.w * y2;
        const wz = q.w * z2;

        const out = this.elements;

        out[0] = 1 - yy - zz;
        out[3] = yx - wz;
        out[6] = zx + wy;

        out[1] = yx + wz;
        out[4] = 1 - xx - zz;
        out[7] = zy - wx;

        out[2] = zx - wy;
        out[5] = zy + wx;
        out[8] = 1 - xx - yy;

        return this;
    }

    fromArray(array: number[], offset?: number) {
        if (offset === undefined) offset = 0;

        for(let i = 0; i < 9; i++) {
            this.elements[i] = array[i + offset];
        }
        return this;
    }
}
