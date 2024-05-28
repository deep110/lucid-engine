(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.LUCID = {}));
})(this, (function (exports) { 'use strict';

    // Body type
    const BODY_DYNAMIC = 0;
    const BODY_STATIC = 1;
    const BODY_KINEMATIC = 2;
    // Shape type
    const SHAPE_SPHERE = 0;
    const SHAPE_BOX = 1;
    const SHAPE_CYLINDER = 2;
    const SHAPE_CAPSULE = 3;
    const SHAPE_POLYGON = 4;
    // AABB approximation
    const AABB_PROX = 0.005;
    const PENETRATION_ALLOWANCE = 0.01;
    const ZERO_THRESHOLD = 0.000001;

    const MathUtil = {
        abs: Math.abs,
        sqrt: Math.sqrt,
        floor: Math.floor,
        cos: Math.cos,
        sin: Math.sin,
        acos: Math.acos,
        asin: Math.asin,
        atan2: Math.atan2,
        round: Math.round,
        pow: Math.pow,
        max: Math.max,
        min: Math.min,
        random: Math.random,
        degtorad: 0.017453292519943,
        radtodeg: 57.295779513082320876,
        PI: 3.141592653589793,
        TwoPI: 6.283185307179586,
        PI90: 1.570796326794896,
        PI270: 4.712388980384689,
        INF: Infinity,
        EPZ: 0.00001,
        EPZ2: 0.000001,
        generateUUID: function () {
            // http://www.broofa.com/Tools/Math.uuid.htm
            const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
            const uuid = new Array(36);
            let rnd = 0, r;
            return function generateUUID() {
                for (let i = 0; i < 36; i++) {
                    if (i === 8 || i === 13 || i === 18 || i === 23) {
                        uuid[i] = '-';
                    }
                    else if (i === 14) {
                        uuid[i] = '4';
                    }
                    else {
                        if (rnd <= 0x02)
                            rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
                        r = rnd & 0xf;
                        rnd = rnd >> 4;
                        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
                return uuid.join("");
            };
        }(),
    };

    class Vec3 {
        constructor(x, y, z) {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        }
        set(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        }
        add(a) {
            const v = new Vec3();
            v.x = this.x + a.x;
            v.y = this.y + a.y;
            v.z = this.z + a.z;
            return v;
        }
        iadd(v) {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
            return this;
        }
        sub(a) {
            const v = new Vec3();
            v.x = this.x - a.x;
            v.y = this.y - a.y;
            v.z = this.z - a.z;
            return v;
        }
        isub(v) {
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
        scale(s) {
            const v = new Vec3();
            v.x = this.x * s;
            v.y = this.y * s;
            v.z = this.z * s;
            return v;
        }
        iscale(s) {
            this.x *= s;
            this.y *= s;
            this.z *= s;
            return this;
        }
        multiply(v) {
            this.x *= v.x;
            this.y *= v.y;
            this.z *= v.z;
            return this;
        }
        addScaledVector(v, s) {
            this.x += v.x * s;
            this.y += v.y * s;
            this.z += v.z * s;
            return this;
        }
        subScaledVector(v, s) {
            this.x -= v.x * s;
            this.y -= v.y * s;
            this.z -= v.z * s;
            return this;
        }
        cross(a) {
            const x = this.x, y = this.y, z = this.z;
            this.x = y * a.z - z * a.y;
            this.y = z * a.x - x * a.z;
            this.z = x * a.y - y * a.x;
            return this;
        }
        tangent(a) {
            const ax = a.x, ay = a.y, az = a.z;
            this.x = ay * ax - az * az;
            this.y = -az * ay - ax * ax;
            this.z = ax * az + ay * ay;
            return this;
        }
        dot(v) {
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
        copy(v) {
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
            if (this.x !== 0 || this.y !== 0 || this.z !== 0)
                return true;
            return false;
        }
        equals(v, y, z) {
            if (v instanceof Vec3) {
                return v.x === this.x && v.y === this.y && v.z === this.z;
            }
            else if (y !== undefined && z !== undefined) {
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
        toArray(array, offset) {
            if (offset === undefined)
                offset = 0;
            array[offset] = this.x;
            array[offset + 1] = this.y;
            array[offset + 2] = this.z;
        }
        fromArray(array, offset) {
            if (offset === undefined)
                offset = 0;
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

    class Quaternion {
        constructor(x, y, z, w) {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = w || 1;
        }
        set(x, y, z, w) {
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
        copy(q) {
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
            }
            else {
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
        multiply(q) {
            const r = new Quaternion();
            return r.multiplyQuaternions(this, q);
        }
        imultiply(q) {
            return this.multiplyQuaternions(this, q);
        }
        multiplyQuaternions(a, b) {
            // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
            const qax = a.x, qay = a.y, qaz = a.z, qaw = a.w;
            const qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;
            this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
            this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
            this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
            this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
            return this;
        }
        multiplyVector(out, v) {
            // r = q . v . q^-1
            // calculate quat * vector
            const ix = this.w * v.x - this.y * v.z + this.z * v.y;
            const iy = this.w * v.y - this.z * v.x + this.x * v.z;
            const iz = this.w * v.z - this.x * v.y + this.y * v.x;
            const iw = this.x * v.x + this.y * v.y + this.z * v.z;
            // calculate result * inverse quat
            out.x = ix * this.w + iw * this.x + iy * this.z - iz * this.y;
            out.y = iy * this.w + iw * this.y + iz * this.x - ix * this.z;
            out.z = iz * this.w + iw * this.z + ix * this.y - iy * this.x;
            return out;
        }
        fromEuler(rotation, order) {
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
        fromAxisAngle(axis, angle) {
            const halfAngle = angle * 0.5;
            const sinHalfAngle = Math.sin(halfAngle);
            this.x = axis.x * sinHalfAngle;
            this.y = axis.y * sinHalfAngle;
            this.z = axis.z * sinHalfAngle;
            this.w = Math.cos(halfAngle);
            return this;
        }
    }

    class Mat33 {
        constructor() {
            this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1];
        }
        set(e00, e01, e02, e10, e11, e12, e20, e21, e22) {
            const te = this.elements;
            te[0] = e00;
            te[1] = e01;
            te[2] = e02;
            te[3] = e10;
            te[4] = e11;
            te[5] = e12;
            te[6] = e20;
            te[7] = e21;
            te[8] = e22;
            return this;
        }
        diagonal(a, b, c) {
            this.elements[0] = a;
            this.elements[4] = b;
            this.elements[8] = c;
        }
        invert() {
            const tm = this.elements;
            let a00 = tm[0], a10 = tm[3], a20 = tm[6], a01 = tm[1], a11 = tm[4], a21 = tm[7], a02 = tm[2], a12 = tm[5], a22 = tm[8], b01 = a22 * a11 - a12 * a21, b11 = -a22 * a10 + a12 * a20, b21 = a21 * a10 - a11 * a20, det = a00 * b01 + a01 * b11 + a02 * b21;
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
        multiplyVector(v) {
            const result = new Vec3();
            result.x = v.x * this.elements[0] + v.y * this.elements[3] + v.z * this.elements[6];
            result.y = v.x * this.elements[1] + v.y * this.elements[4] + v.z * this.elements[7];
            result.z = v.x * this.elements[2] + v.y * this.elements[5] + v.z * this.elements[8];
            return result;
        }
        fromQuat(q) {
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
        fromArray(array, offset) {
            if (offset === undefined)
                offset = 0;
            for (let i = 0; i < 9; i++) {
                this.elements[i] = array[i + offset];
            }
            return this;
        }
    }

    class RigidBody {
        constructor(params) {
            this.id = MathUtil.generateUUID();
            this.shape = params.shape;
            this.position = new Vec3();
            this.rotation = new Quaternion();
            this.scale = new Vec3(1, 1, 1);
            if (params.position !== undefined)
                this.position.fromArray(params.position);
            if (params.rotation !== undefined) {
                const order = params.rotationOrder || "XYZ";
                this.rotation.fromEuler(params.rotation, order);
            }
            if (params.scale !== undefined)
                this.scale.fromArray(params.scale);
            this.netForce = new Vec3();
            this.netTorque = new Vec3();
            this.linearVelocity = new Vec3();
            this.angularVelocity = new Vec3();
            this.type = params.type || BODY_DYNAMIC;
            this.mass = params.mass || 1.0;
            this.invMass = 1 / this.mass;
            this.invInertia = new Mat33();
            this.restitution = params.restitution || 0.8;
            this.staticFriction = params.staticFriction || 0.3;
            this.dynamicFriction = params.dynamicFriction || 0.1;
        }
        getPosition() {
            return this.position;
        }
        getRotation() {
            return this.rotation;
        }
        getScale() {
            return this.scale;
        }
        addCollider(collider) {
            this.collider = collider;
            this.calculateMassInfo();
        }
        canMove() {
            return this.type == BODY_DYNAMIC && this.invMass > 0;
        }
        applyForce(force, point) {
            if (!this.canMove()) {
                return;
            }
            this.netForce.addScaledVector(force, this.mass);
            // if point is passed, then force might not be getting applied on COM
            // this will also give rise to `Torque = F x r`
            if (point) {
                const r = point.sub(this.position);
                this.netTorque.iadd(r.cross(force));
            }
        }
        applyImpulse(impulse, point) {
            if (this.canMove()) {
                this.linearVelocity.addScaledVector(impulse, this.invMass);
            }
        }
        move(dt, linear_damping, angular_damping) {
            var _a;
            if (!this.canMove()) {
                return;
            }
            // integrate velocity
            // F = m dv / dt
            this.linearVelocity.addScaledVector(this.netForce, this.invMass * dt);
            this.angularVelocity.addScaledVector(this.invInertia.multiplyVector(this.netTorque), dt);
            // apply air friction damping
            this.linearVelocity.iscale(linear_damping);
            this.angularVelocity.iscale(angular_damping);
            // integrate velocity to get updated position
            this.position.addScaledVector(this.linearVelocity, dt);
            // integrate angular velocity to get rotation
            //
            // not so straight forward since angular velocity is Vec3 and rotation is Quaternion
            // https://gafferongames.com/post/physics_in_3d/
            const halfAngle = this.angularVelocity.length() * 0.5;
            if (halfAngle > ZERO_THRESHOLD) {
                // convert angular velocity to Quaternion
                const rotationAxis = this.angularVelocity.clone().normalize();
                const angularVelocityQuat = new Quaternion().fromAxisAngle(rotationAxis, halfAngle);
                // integrate rotation
                this.rotation.imultiply(angularVelocityQuat);
                this.rotation.normalize();
            }
            // update collider
            (_a = this.collider) === null || _a === void 0 ? void 0 : _a.update(this);
        }
        reset_force() {
            this.netForce.reset();
            this.netTorque.reset();
        }
        calculateMassInfo() {
            var _a;
            if (this.type == BODY_STATIC) {
                this.invMass = 0;
                this.mass = 0;
                this.invInertia.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
                return;
            }
            // set the initial inertia of the model
            (_a = this.collider) === null || _a === void 0 ? void 0 : _a.calculateMassInfo(this.mass, this.invInertia);
            // invert the inertia
            this.invInertia.invert();
        }
    }

    class Collider {
        constructor(shapeType, rigidbody) {
            this.shape = shapeType;
        }
        calculateMassInfo(mass, inertia) {
            throw new Error("Collider: calculateMassInfo - Inheritance Error");
        }
        update(rigidbody) {
            throw new Error("Collider: Update - Inheritance Error");
        }
    }

    class BoxCollider extends Collider {
        constructor(shapeType, rigidbody) {
            super(shapeType, rigidbody);
            this.center = rigidbody.position.clone();
            this.half_extents = rigidbody.scale.scale(0.5);
            this.orientation = rigidbody.rotation.clone();
        }
        calculateMassInfo(mass, inertia) {
            const p = mass / 3;
            inertia.diagonal(p * (this.half_extents.y * this.half_extents.y + this.half_extents.z * this.half_extents.z), p * (this.half_extents.x * this.half_extents.x + this.half_extents.z * this.half_extents.z), p * (this.half_extents.x * this.half_extents.x + this.half_extents.y * this.half_extents.y));
        }
        update(rigidbody) {
            this.center.copy(rigidbody.position);
            this.orientation.copy(rigidbody.rotation);
        }
    }

    class SphereCollider extends Collider {
        constructor(shapeType, rigidbody) {
            super(shapeType, rigidbody);
            // set radius
            this.radius = rigidbody.scale.x / 2;
            this.radiusSq = this.radius * this.radius;
            // set center
            this.center = rigidbody.position.clone();
        }
        calculateMassInfo(mass, inertia) {
            // moment of inertia of a sphere = 2 / 5 MR^2
            const inertiaValue = mass * this.radius * this.radius * 0.4;
            inertia.diagonal(inertiaValue, inertiaValue, inertiaValue);
        }
        update(rigidbody) {
            this.center.copy(rigidbody.position);
        }
    }

    class BoxBoxCollisionDetector {
        detectCollision(colliderA, colliderB, manifold) {
        }
    }

    class SphereSphereCollisionDetector {
        constructor() {
            this.distance = new Vec3();
        }
        detectCollision(colliderA, colliderB, manifold) {
            const sphereA = colliderA;
            const sphereB = colliderB;
            // distance between their centers should be less than sum of radii
            const rSum = sphereA.radius + sphereB.radius;
            this.distance.copy(sphereB.center).isub(sphereA.center);
            if (this.distance.lengthSq() < rSum * rSum) {
                manifold.hasCollision = true;
                manifold.update(this.distance, rSum - this.distance.length());
            }
        }
    }

    class BoxSphereCollisionDetector {
        constructor(flip = false) {
            this.flip = flip;
            this.sphCenter = new Vec3();
            this.cuboidPoint = new Vec3();
            this.normal = new Vec3();
            this.boxOrientationConj = new Quaternion();
        }
        detectCollision(colliderA, colliderB, manifold) {
            const box = this.flip ? colliderB : colliderA;
            const sphere = this.flip ? colliderA : colliderB;
            // transform sphere's center to box's local coordinate system
            this.sphCenter.copy(sphere.center).isub(box.center);
            if (box.orientation.w != 1.0) {
                box.orientation.multiplyVector(this.sphCenter, this.sphCenter);
            }
            // Calculate the closest point on the cuboid to the sphere center
            // It will be sphere's center if sphere's center is inside the cuboid
            this.cuboidPoint.x = Math.max(-box.half_extents.x, Math.min(this.sphCenter.x, box.half_extents.x));
            this.cuboidPoint.y = Math.max(-box.half_extents.y, Math.min(this.sphCenter.y, box.half_extents.y));
            this.cuboidPoint.z = Math.max(-box.half_extents.z, Math.min(this.sphCenter.z, box.half_extents.z));
            let distanceV = this.sphCenter.isub(this.cuboidPoint);
            const distanceSq = distanceV.lengthSq();
            if (distanceSq < sphere.radiusSq) {
                manifold.hasCollision = true;
                // handle special case when sphere's center is inside the box
                if (distanceSq == 0) {
                    // we can take normal direction to be vector between two centers
                    this.normal.copy(sphere.center).isub(box.center);
                }
                else {
                    // inverse transform this cuboid point
                    if (box.orientation.w != 1.0) {
                        this.boxOrientationConj.copy(box.orientation).conjugate().multiplyVector(this.cuboidPoint, this.cuboidPoint);
                    }
                    this.cuboidPoint.iadd(box.center);
                    this.normal.copy(sphere.center).isub(this.cuboidPoint);
                }
                if (this.flip) {
                    manifold.update(this.normal.iscale(-1), sphere.radius - Math.sqrt(distanceSq));
                }
                else {
                    manifold.update(this.normal, sphere.radius - Math.sqrt(distanceSq));
                }
            }
        }
    }

    class Manifold {
        constructor(bodyA, bodyB) {
            this.bodyA = bodyA;
            this.bodyB = bodyB;
            // collision direction
            this.collisionNormal = new Vec3();
            this.penetrationDepth = 0;
            this.hasCollision = false;
        }
        update(collisionNormal, penetrationDepth) {
            this.collisionNormal.copy(collisionNormal);
            this.penetrationDepth = penetrationDepth;
            // normalize the collision normal
            this.collisionNormal.normalize();
        }
    }

    class NarrowPhaseSolver {
        constructor() {
            this.shape_matrix = [{}, {}, {}, {}, {}];
            this.shape_matrix[SHAPE_SPHERE][SHAPE_SPHERE] = new SphereSphereCollisionDetector();
            this.shape_matrix[SHAPE_SPHERE][SHAPE_BOX] = new BoxSphereCollisionDetector(true);
            this.shape_matrix[SHAPE_BOX][SHAPE_SPHERE] = new BoxSphereCollisionDetector();
            this.shape_matrix[SHAPE_BOX][SHAPE_BOX] = new BoxBoxCollisionDetector();
        }
        solve(rigidbodies) {
            const numBodies = rigidbodies.length;
            const collisions = [];
            for (let i = 0; i < numBodies; i++) {
                for (let j = i + 1; j < numBodies; j++) {
                    const bodyA = rigidbodies[i];
                    const bodyB = rigidbodies[j];
                    if (bodyA.collider && bodyB.collider) {
                        const detector = this.shape_matrix[bodyA.collider.shape][bodyB.collider.shape];
                        const manifold = new Manifold(bodyA, bodyB);
                        detector.detectCollision(bodyA.collider, bodyB.collider, manifold);
                        if (manifold.hasCollision) {
                            collisions.push(manifold);
                        }
                    }
                }
            }
            return collisions;
        }
    }

    class World {
        constructor(params) {
            if (!(params instanceof Object))
                params = {};
            this.timestep = params.timestep || 1 / 60;
            this.iterations = params.iterations || 8;
            // set gravity
            this.gravity = new Vec3(0, -9.8, 0);
            if (params.gravity !== undefined)
                this.gravity.fromArray(params.gravity);
            this.linear_damping = params.linear_damping || 1;
            this.angular_damping = params.angular_damping || 0.9;
            this.rigidbodies = [];
            this.narrow_phase_solver = new NarrowPhaseSolver();
        }
        step() {
            // find collisions using narrow phase
            const collisions = this.narrow_phase_solver.solve(this.rigidbodies);
            // solve collisions
            this.runImpulseSolver(collisions);
            this.runPositionCorrectionSolver(collisions);
            for (let i = 0; i < this.rigidbodies.length; i++) {
                const body = this.rigidbodies[i];
                // calculate net force on body, right now it is just gravity
                body.applyForce(this.gravity);
                // move the body due to force or impulse during collision
                body.move(this.timestep, this.linear_damping, this.angular_damping);
                // reset force
                body.reset_force();
            }
        }
        setGravity(grArr) {
            this.gravity.fromArray(grArr);
        }
        addRigidbody(bodyParams) {
            const rb = new RigidBody(bodyParams);
            const collider = this.createCollider(bodyParams.shape, rb);
            if (collider == undefined) {
                console.error("Collider of shape: ", bodyParams.shape, " cannot be created");
                return;
            }
            rb.addCollider(collider);
            this.rigidbodies.push(rb);
            return rb;
        }
        removeRigidbody(rb) {
        }
        clear() {
            this.rigidbodies = [];
        }
        getNumRigidbodies() {
            return this.rigidbodies.length;
        }
        runImpulseSolver(collisions) {
            for (let i = 0; i < collisions.length; i++) {
                const manifold = collisions[i];
                const bodyA = manifold.bodyA;
                const bodyB = manifold.bodyB;
                const relVelocity = bodyB.linearVelocity.sub(bodyA.linearVelocity);
                // Relative velocity along the normal
                let contactSpeed = relVelocity.dot(manifold.collisionNormal);
                // only proceed forward if bodies are separating
                if (contactSpeed > 0) {
                    continue;
                }
                // Normal Impulse
                const e = bodyA.restitution * bodyB.restitution;
                const totalInvMass = bodyA.invMass + bodyB.invMass;
                const impulseMag = -(1 + e) * contactSpeed / totalInvMass;
                const impulse = manifold.collisionNormal.scale(impulseMag);
                bodyB.applyImpulse(impulse);
                bodyA.applyImpulse(impulse.negate());
                // Frictional Impulse
                relVelocity.copy(bodyB.linearVelocity).isub(bodyA.linearVelocity);
                contactSpeed = relVelocity.dot(manifold.collisionNormal);
                // get direction of relative velocity perpendicular to collision normal
                const tangent = relVelocity.clone().subScaledVector(manifold.collisionNormal, contactSpeed);
                tangent.normalize();
                let mu = MathUtil.sqrt(bodyA.staticFriction * bodyA.staticFriction + bodyB.staticFriction * bodyB.staticFriction);
                const frictionImpulseMag = -relVelocity.dot(tangent) / totalInvMass;
                // Coulomb's Law:  F <= μFn
                //
                // use static friction if friction force less than Normal force
                if (MathUtil.abs(frictionImpulseMag) < impulseMag * mu) {
                    impulse.copy(tangent).iscale(frictionImpulseMag);
                }
                else {
                    mu = MathUtil.sqrt(bodyA.dynamicFriction * bodyA.dynamicFriction + bodyB.dynamicFriction * bodyB.dynamicFriction);
                    impulse.copy(tangent).iscale(-impulseMag * mu);
                }
                bodyB.applyImpulse(impulse);
                bodyA.applyImpulse(impulse.negate());
            }
        }
        /**
         * This is required to prevent rigidbodies from passing each other.
         * Impulse resolution does change the velocity but still position needs to be forcefully
         * updated to separate out the colliding bodies
         *
         * @param collisions pairs of colliding rigidbodies
         */
        runPositionCorrectionSolver(collisions) {
            for (let i = 0; i < collisions.length; i++) {
                const manifold = collisions[i];
                const bodyA = manifold.bodyA;
                const bodyB = manifold.bodyB;
                const correction = MathUtil.max(0, manifold.penetrationDepth - PENETRATION_ALLOWANCE) * 0.8
                    / (bodyA.invMass + bodyB.invMass);
                if (bodyA.canMove()) {
                    bodyA.position.subScaledVector(manifold.collisionNormal, bodyA.invMass * correction);
                }
                if (bodyB.canMove()) {
                    bodyB.position.addScaledVector(manifold.collisionNormal, bodyB.invMass * correction);
                }
            }
        }
        createCollider(shape, body) {
            switch (shape) {
                case SHAPE_BOX:
                    return new BoxCollider(SHAPE_BOX, body);
                case SHAPE_SPHERE:
                    return new SphereCollider(SHAPE_SPHERE, body);
            }
        }
    }

    exports.AABB_PROX = AABB_PROX;
    exports.BODY_DYNAMIC = BODY_DYNAMIC;
    exports.BODY_KINEMATIC = BODY_KINEMATIC;
    exports.BODY_STATIC = BODY_STATIC;
    exports.Mat33 = Mat33;
    exports.PENETRATION_ALLOWANCE = PENETRATION_ALLOWANCE;
    exports.Quaternion = Quaternion;
    exports.RigidBody = RigidBody;
    exports.SHAPE_BOX = SHAPE_BOX;
    exports.SHAPE_CAPSULE = SHAPE_CAPSULE;
    exports.SHAPE_CYLINDER = SHAPE_CYLINDER;
    exports.SHAPE_POLYGON = SHAPE_POLYGON;
    exports.SHAPE_SPHERE = SHAPE_SPHERE;
    exports.Vec3 = Vec3;
    exports.World = World;
    exports.ZERO_THRESHOLD = ZERO_THRESHOLD;

}));
