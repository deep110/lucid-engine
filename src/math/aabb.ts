import { Vec3 } from "./vec3";

export class AABB {
    center: Vec3;
    rx: number;
    ry: number;
    rz: number;

    constructor(center: Vec3, rx: number, ry: number, rz: number) {
        this.center = center || new Vec3();
        this.rx = rx || 0;
        this.ry = ry || 0;
        this.rz = rz || 0;
    }

    intersect(aabb: AABB) {
        
    }
}
