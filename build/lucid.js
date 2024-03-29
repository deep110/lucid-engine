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
    const SHAPE_PLANE = 1;
    const SHAPE_BOX = 2;
    const SHAPE_CYLINDER = 3;
    const SHAPE_CAPSULE = 4;
    const SHAPE_POLYGON = 5;
    // AABB approximation
    const AABB_PROX = 0.005;
    const PENETRATION_ALLOWANCE = 0.01;

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
            const invLength = 1 / this.length();
            return this.iscale(invLength);
        }
        safeNormalize() {
            let len = this.length();
            if (len > 0.0001) {
                this.iscale(1 / len);
            }
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
        rotate(q) {
            // v' = q^−1 vq
            // calculate quat * vector
            const ix = q.w * this.x + q.y * this.z - q.z * this.y;
            const iy = q.w * this.y + q.z * this.x - q.x * this.z;
            const iz = q.w * this.z + q.x * this.y - q.y * this.x;
            const iw = -q.x * this.x - q.y * this.y - q.z * this.z;
            // calculate result * inverse quat
            this.x = ix * q.w + iw * -q.x + iy * -q.z - iz * -q.y;
            this.y = iy * q.w + iw * -q.y + iz * -q.x - ix * -q.z;
            this.z = iz * q.w + iw * -q.z + ix * -q.y - iy * -q.x;
        }
        // applyMatrix3(m, transpose) {
        // 	const x = this.x, y = this.y, z = this.z;
        // 	const e = m.elements;
        // 	if (transpose) {
        // 		this.x = e[0] * x + e[1] * y + e[2] * z;
        // 		this.y = e[3] * x + e[4] * y + e[5] * z;
        // 		this.z = e[6] * x + e[7] * y + e[8] * z;
        // 	} else {
        // 		this.x = e[0] * x + e[3] * y + e[6] * z;
        // 		this.y = e[1] * x + e[4] * y + e[7] * z;
        // 		this.z = e[2] * x + e[5] * y + e[8] * z;
        // 	}
        // 	return this;
        // }
        isZero() {
            if (this.x !== 0 || this.y !== 0 || this.z !== 0)
                return true;
            return false;
        }
        equals(v) {
            return v.x === this.x && v.y === this.y && v.z === this.z;
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
            let r = new Quaternion();
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
    }

    class RigidBody {
        constructor(params) {
            this.id = MathUtil.generateUUID();
            this.position = new Vec3();
            this.rotation = new Quaternion();
            this.scale = new Vec3(1, 1, 1);
            if (params.position !== undefined)
                this.position.fromArray(params.position);
            if (params.rotation !== undefined) {
                let order = params.rotationOrder || "XYZ";
                this.rotation.fromEuler(params.rotation, order);
            }
            if (params.scale !== undefined)
                this.scale.fromArray(params.scale);
            this.force = new Vec3();
            this.torque = new Vec3();
            this.linearVelocity = new Vec3();
            this.angularVelocity = new Vec3();
            this.type = params.type || BODY_DYNAMIC;
            this.mass = 1;
            this.invMass = 1 / this.mass;
            if (this.type == BODY_STATIC) {
                this.mass = MathUtil.INF;
                this.invMass = 0;
            }
            this.density = params.density || 1;
            this.restitution = params.restitution || 0.8;
            this.staticFriction = params.staticFriction || 0.3;
            this.dynamicFriction = params.dynamicFriction || 0.1;
        }
        getPosition() {
            return this.position;
        }
        getQuaternion() {
            return this.rotation;
        }
        addCollider(collider) {
            this.collider = collider;
        }
        canMove() {
            return this.type == BODY_DYNAMIC && this.invMass > 0;
        }
        move(dt) {
            if (!this.canMove()) {
                return;
            }
            this.linearVelocity.addScaledVector(this.force, this.invMass * dt);
            this.position.addScaledVector(this.linearVelocity, dt);
            // TODO: account for rotation
            // update collider
            if (this.collider)
                this.collider.update(this);
        }
        applyImpulse(impulse) {
            if (this.canMove()) {
                this.linearVelocity.addScaledVector(impulse, this.invMass);
            }
        }
    }

    class Manifold {
        constructor(bodyA, bodyB) {
            this.bodyA = bodyA;
            this.bodyB = bodyB;
            // Furthest point of A into B
            this.A = undefined;
            // Furthest point of B into A
            this.B = undefined;
            // B - A normalized
            this.collisionNormal = new Vec3();
            // Length of B - A
            this.penetrationDepth = 0;
            this.hasCollision = false;
        }
        update(A, B) {
            this.A = A;
            this.B = B;
            this.collisionNormal.copy(A).isub(B);
            this.penetrationDepth = this.collisionNormal.length();
            // normalize the collision normal
            this.collisionNormal.iscale(1 / this.penetrationDepth);
        }
    }

    class Collider {
        constructor(shapeType, rigidbody) {
            this.shape = shapeType;
        }
        update(rigidbody) {
            throw new Error("Collider: Update Inheritance Error");
        }
    }

    // import { Vec3 } from "../math/index";
    class BoxCollider extends Collider {
        constructor(shapeType, rigidbody) {
            super(shapeType, rigidbody);
        }
    }

    class SphereCollider extends Collider {
        constructor(shapeType, rigidbody) {
            super(shapeType, rigidbody);
            // set radius
            this.radius = rigidbody.scale.x;
            // set center
            this.center = rigidbody.position.clone();
        }
        update(rigidbody) {
            this.center.copy(rigidbody.position);
        }
    }

    class PlaneCollider extends Collider {
        constructor(shapeType, rigidbody) {
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
            // for now set the normal
            // this.normal.set(0, 1, 0);
            this.normal.rotate(rigidbody.rotation);
            // cache the Vec(n) . Vec(ro)
            this.d = this.normal.dot(this.point);
        }
        update(rigidbody) {
            // planes don't move or rotate
        }
    }

    class SpherePlaneCollisionDetector {
        constructor(flip = false) {
            this.flip = flip;
        }
        detectCollision(colliderA, colliderB, manifold) {
            const sphere = this.flip ? colliderB : colliderA;
            const plane = this.flip ? colliderA : colliderB;
            // TODO: add check for plane dimensions for finite planes
            // find the signed distance of sphere's center from plane
            const distance = sphere.center.dot(plane.normal) - plane.d;
            if (MathUtil.abs(distance) < sphere.radius) {
                manifold.hasCollision = true;
                const B = sphere.center.clone().subScaledVector(plane.normal, distance);
                const A = sphere.center.clone().subScaledVector(plane.normal, sphere.radius);
                if (this.flip) {
                    manifold.update(B, A);
                }
                else {
                    manifold.update(A, B);
                }
            }
        }
    }

    class SphereSphereCollisionDetector {
        detectCollision(colliderA, colliderB, manifold) {
            const sphereA = colliderA;
            const sphereB = colliderB;
            // distance between their centers should be less than sum of radii
            let rSum = sphereA.radius + sphereB.radius;
            let dist = sphereB.center.sub(sphereA.center);
            if (dist.lengthSq() < rSum * rSum) {
                manifold.hasCollision = true;
                let normal = dist.normalize();
                let A = sphereA.center.clone().addScaledVector(normal, sphereA.radius);
                let B = sphereB.center.clone().addScaledVector(normal.negate(), sphereA.radius);
                manifold.update(A, B);
            }
        }
    }

    class World {
        constructor(params) {
            if (!(params instanceof Object))
                params = {};
            this.timestep = params.timestep || 1 / 60;
            this.iterations = params.iterations || 8;
            this.scale = params.worldscale || 1;
            this.invScale = 1 / this.scale;
            // set gravity
            this.gravity = new Vec3(0, -9.8, 0);
            if (params.gravity !== undefined)
                this.gravity.fromArray(params.gravity);
            this.rigidbodies = [];
            this.detector = [{}, {}, {}, {}, {}];
            this.detector[SHAPE_SPHERE][SHAPE_SPHERE] = new SphereSphereCollisionDetector();
            this.detector[SHAPE_SPHERE][SHAPE_PLANE] = new SpherePlaneCollisionDetector();
            this.detector[SHAPE_PLANE][SHAPE_SPHERE] = new SpherePlaneCollisionDetector(true);
        }
        step() {
            // apply gravity force
            for (let i = 0; i < this.rigidbodies.length; i++) {
                const body = this.rigidbodies[i];
                if (body.canMove()) {
                    body.force.addScaledVector(this.gravity, body.mass);
                }
            }
            // find collisions using narrow phase
            const collisions = this.runNarrowPhaseCollisionDetector();
            // solve collisions
            this.runImpulseSolver(collisions);
            this.runPositionCorrectionSolver(collisions);
            // update velocity & position
            for (let i = 0; i < this.rigidbodies.length; i++) {
                const body = this.rigidbodies[i];
                body.move(this.timestep);
                // reset force
                body.force.reset();
                body.torque.reset();
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
        runNarrowPhaseCollisionDetector() {
            const numBodies = this.rigidbodies.length;
            const collisions = [];
            for (let i = 0; i < numBodies; i++) {
                for (let j = i + 1; j < numBodies; j++) {
                    const bodyA = this.rigidbodies[i];
                    const bodyB = this.rigidbodies[j];
                    if (bodyA.collider && bodyB.collider) {
                        const detector = this.detector[bodyA.collider.shape][bodyB.collider.shape];
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
                tangent.safeNormalize();
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
                let correction = MathUtil.max(0, manifold.penetrationDepth - PENETRATION_ALLOWANCE) * 0.8
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
                case SHAPE_PLANE:
                    return new PlaneCollider(SHAPE_PLANE, body);
            }
        }
    }

    exports.AABB_PROX = AABB_PROX;
    exports.BODY_DYNAMIC = BODY_DYNAMIC;
    exports.BODY_KINEMATIC = BODY_KINEMATIC;
    exports.BODY_STATIC = BODY_STATIC;
    exports.PENETRATION_ALLOWANCE = PENETRATION_ALLOWANCE;
    exports.Quaternion = Quaternion;
    exports.RigidBody = RigidBody;
    exports.SHAPE_BOX = SHAPE_BOX;
    exports.SHAPE_CAPSULE = SHAPE_CAPSULE;
    exports.SHAPE_CYLINDER = SHAPE_CYLINDER;
    exports.SHAPE_PLANE = SHAPE_PLANE;
    exports.SHAPE_POLYGON = SHAPE_POLYGON;
    exports.SHAPE_SPHERE = SHAPE_SPHERE;
    exports.Vec3 = Vec3;
    exports.World = World;

}));
