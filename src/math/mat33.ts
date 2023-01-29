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


}
