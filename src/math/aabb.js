import { Vec3 } from "./vec3";

class AABB {
    constructor(center, rx, ry, rz) {
        this.center = center || new Vec3();
        this.rx = rx || 0;
        this.ry = ry || 0;
        this.rz = rz || 0;
    }

    intersect(aabb) {
        
    }
}

export { AABB };
