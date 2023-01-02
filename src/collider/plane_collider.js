import { Vec3 } from "../math/vec3";
import { Collider } from "./collider";

export class PlaneCollider extends Collider {
    constructor(shapeType, config, rigidbody) {
        super(shapeType, config, rigidbody);

        // representing plane in vector form:
        // 
        // Vec(n) . [ Vec(r) - Vec(ro) ] = 0
        // where,
        //     ro is any point on the plane
        //     n is normal vector perpendicular to plane
        this.normal = new Vec3();
        this.point = rigidbody.position.clone();

        // for now set the normal
        this.normal.set(0, 1, 0);

        // cache the Vec(n) . Vec(ro)
        this.d = this.normal.dot(this.point);
    }

    update(rigidbody) {
        // planes don't move or rotate
    }
}
