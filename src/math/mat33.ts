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
        var te = this.elements;
        te[0] = e00; te[1] = e01; te[2] = e02;
        te[3] = e10; te[4] = e11; te[5] = e12;
        te[6] = e20; te[7] = e21; te[8] = e22;

        return this;
    }

    invert() {
        var tm = this.elements;
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
        var te = this.elements;

        return te[0] * te[4] * te[8] - te[0] * te[5] * te[7] - te[1] * te[3] * te[8] + te[1] * te[5] * te[6] 
            + te[2] * te[3] * te[7] - te[2] * te[4] * te[6];
    }

    fromArray(array: number[], offset?: number) {
        if (offset === undefined) offset = 0;

        for( var i = 0; i < 9; i ++ ) {
            this.elements[i] = array[i + offset];
        }
        return this;
    }

}
