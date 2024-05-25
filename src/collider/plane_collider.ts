import { Mat33, Vec3 } from "../math/index";
import { Collider } from "./collider";
import { RigidBody } from "../core/rigidbody";

export class PlaneCollider extends Collider {
    dims: Vec3;
    normal: Vec3;
    point: Vec3;
    d: number;

    constructor(shapeType: number, rigidbody: RigidBody) {
        super(shapeType, rigidbody);

        // TODO: account for rotation
        this.dims = rigidbody.scale.clone();

        // representing plane in vector form:
        // 
        // Vec(n) . [ Vec(r) - Vec(ro) ] = 0
        // where,
        //     ro is any point on the plane
        //     n is normal vector perpendicular to plane
        this.normal = new Vec3(0, 0, 1);
        this.point = rigidbody.position.clone();

        // rotate the normal to rigidbody's rotation
        this.normal = rigidbody.rotation.multiplyVector(this.normal);

        // cache the Vec(n) . Vec(ro)
        this.d = this.normal.dot(this.point);
    }

    calculateMassInfo(mass: number, inertia: Mat33): void {
        let inertiaValue = 1;
		inertia.set(inertiaValue, 0, 0, 0, inertiaValue, 0, 0, 0, inertiaValue);
    }

    update(rigidbody: RigidBody) {
        // planes don't move or rotate
    }
}
