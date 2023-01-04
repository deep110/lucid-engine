import { Vec3 } from "../math/index";
import { Collider } from "./collider";
import { RigidBody } from "../core/rigidbody";

export class PlaneCollider extends Collider {
    normal: Vec3;
    point: Vec3;
    d: number;

    constructor(shapeType: number, rigidbody: RigidBody) {
        super(shapeType, rigidbody);

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

    update(rigidbody: RigidBody) {
        // planes don't move or rotate
    }
}
