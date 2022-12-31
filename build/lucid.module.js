// Body type
var BODY_DYNAMIC = 0;
var BODY_STATIC = 1;
var BODY_KINEMATIC = 2;

// Shape type
var SHAPE_SPHERE = 0;
var SHAPE_PLANE = 1;
var SHAPE_BOX = 2;
var SHAPE_CYLINDER = 3;
var SHAPE_POLYGON = 4;

// BroadPhase
var BR_NULL = 0;
var BR_BRUTE_FORCE = 1;
var BR_SWEEP_AND_PRUNE = 2;
var BR_BOUNDING_VOLUME_TREE = 3;

// AABB approximation
var AABB_PROX = 0.005;

var MathUtil = {
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

	degtorad: 0.0174532925199432957,
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
		var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
		var uuid = new Array(36);
		var rnd = 0, r;

		return function generateUUID() {
			for (var i = 0; i < 36; i++) {
				if (i === 8 || i === 13 || i === 18 || i === 23) {
					uuid[i] = '-';
				} else if (i === 14) {
					uuid[i] = '4';
				} else {
					if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
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

	add(a, b) {
		if (b !== undefined) return this.addVectors(a, b);

		this.x += a.x;
		this.y += a.y;
		this.z += a.z;
		return this;
	}

	addVectors(a, b) {
		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;
		return this;
	}

	addEqual(v) {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		return this;
	}

	sub(a, b) {
		if (b !== undefined) return this.subVectors(a, b);

		this.x -= a.x;
		this.y -= a.y;
		this.z -= a.z;
		return this;
	}

	subVectors(a, b) {
		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;
		return this;
	}

	subEqual(v) {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		return this;
	}

	/**
	 * 
	 * @param {Vec3} v vector to use for scale
	 * @param {Number} s scalar value to multiply
	 * 
	 * Performs operation: vec x = vec v * s
	 * 
	 * @returns Scaled Vector
	 */
	scale(v, s) {
		this.x = v.x * s;
		this.y = v.y * s;
		this.z = v.z * s;
		return this;
	}

	scaleEqual(s) {
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

	cross(a, b) {
		if (b !== undefined) return this.crossVectors(a, b);

		var x = this.x, y = this.y, z = this.z;

		this.x = y * a.z - z * a.y;
		this.y = z * a.x - x * a.z;
		this.z = x * a.y - y * a.x;

		return this;
	}

	crossVectors(a, b) {
		var ax = a.x, ay = a.y, az = a.z;
		var bx = b.x, by = b.y, bz = b.z;

		this.x = ay * bz - az * by;
		this.y = az * bx - ax * bz;
		this.z = ax * by - ay * bx;

		return this;
	}

	tangent(a) {
		var ax = a.x, ay = a.y, az = a.z;

		this.x = ay * ax - az * az;
		this.y = -az * ay - ax * ax;
		this.z = ax * az + ay * ay;

		return this;
	}

	invert(v) {
		this.x = -v.x;
		this.y = -v.y;
		this.z = -v.z;
		return this;
	}

	negate() {
		this.x = -this.x;
		this.y = -this.y;
		this.z = -this.z;

		return this;
	}

	dot(v) {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}

	addition() {
		return this.x + this.y + this.z;
	}

	lengthSq() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}

	length() {
		return MathUtil.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	copy(v) {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		return this;
	}

	applyMatrix3(m, transpose) {

		var x = this.x, y = this.y, z = this.z;
		var e = m.elements;

		if (transpose) {
			this.x = e[0] * x + e[1] * y + e[2] * z;
			this.y = e[3] * x + e[4] * y + e[5] * z;
			this.z = e[6] * x + e[7] * y + e[8] * z;
		} else {
			this.x = e[0] * x + e[3] * y + e[6] * z;
			this.y = e[1] * x + e[4] * y + e[7] * z;
			this.z = e[2] * x + e[5] * y + e[8] * z;
		}

		return this;
	}

	applyQuaternion(q) {
		var x = this.x;
		var y = this.y;
		var z = this.z;

		var qx = q.x;
		var qy = q.y;
		var qz = q.z;
		var qw = q.w;

		// calculate quat * vector

		var ix = qw * x + qy * z - qz * y;
		var iy = qw * y + qz * x - qx * z;
		var iz = qw * z + qx * y - qy * x;
		var iw = -qx * x - qy * y - qz * z;

		// calculate result * inverse quat

		this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
		this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
		this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

		return this;
	}

	testZero() {
		if (this.x !== 0 || this.y !== 0 || this.z !== 0) return true;

		return false;
	}

	equals(v) {
		return v.x === this.x && v.y === this.y && v.z === this.z;
	}

	clone() {
		return new this.constructor(this.x, this.y, this.z);
	}

	toString() {
		return "Vec3[" + this.x.toFixed(4) + ", " + this.y.toFixed(4) + ", " + this.z.toFixed(4) + "]";
	}

	multiplyScalar(scalar) {
		if (isFinite(scalar)) {
			this.x *= scalar;
			this.y *= scalar;
			this.z *= scalar;
		} else {
			this.x = 0;
			this.y = 0;
			this.z = 0;
		}

		return this;
	}

	divideScalar(scalar) {
		return this.multiplyScalar(1 / scalar);
	}

	normalize() {
		return this.divideScalar(this.length());
	}

	toArray(array, offset) {
		if (offset === undefined) offset = 0;

		array[offset] = this.x;
		array[offset + 1] = this.y;
		array[offset + 2] = this.z;
	}

	fromArray(array, offset) {
		if (offset === undefined) offset = 0;

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
		return new Quat(this.x, this.y, this.z, this.w);
	}

	fromEuler(v) {
		this.x = MathUtil.cos(v.z/2) * MathUtil.cos(v.y/2) * MathUtil.sin(v.x/2) - MathUtil.sin(v.z/2) * MathUtil.sin(v.y/2) * MathUtil.cos(v.x/2);
		this.y = MathUtil.cos(v.z/2) * MathUtil.sin(v.y/2) * MathUtil.cos(v.x/2) + MathUtil.sin(v.z/2) * MathUtil.cos(v.y/2) * MathUtil.sin(v.x/2);
		this.z = MathUtil.sin(v.z/2) * MathUtil.cos(v.y/2) * MathUtil.cos(v.x/2) - MathUtil.cos(v.z/2) * MathUtil.sin(v.y/2) * MathUtil.sin(v.x/2);
		this.w = MathUtil.cos(v.z/2) * MathUtil.cos(v.y/2) * MathUtil.cos(v.x/2) + MathUtil.sin(v.z/2) * MathUtil.sin(v.y/2) * MathUtil.sin(v.x/2);
	}
}

class RigidBody {

	constructor(params) {
		if (!(params instanceof Object)) params = {};

		this.id = MathUtil.generateUUID();
		this.position = new Vec3();
		this.orientation = new Quaternion();
		this.rotation = new Vec3();

		if (params.position !== undefined) this.position.fromArray(params.position);
		if (params.rotation !== undefined) {
			this.rotation.fromArray(params.rotation);
			this.orientation.fromEuler(this.rotation);
		}

		this.force = new Vec3();
		this.linearVelocity = new Vec3();
		this.angularVelocity = new Vec3();

		this.mass = 1;
		this.invMass = 1 / this.mass;
		this.move = params.move;

		this.collider = undefined;
	}

	getPosition() {
		return this.position;
	}

	getQuaternion() {
		return this.orientation;
	}

	addCollider(collider) {
		this.collider = collider;
	}

}

class Collider {

	constructor(shape, config) {
		this.shape = shape;

		this.density = config.density || 1;
		this.friction = config.friction || 0.2;
		this.restitution = config.restitution || 0.6;

	}

}

class BoxCollider extends Collider {

	constructor(shape, config) {
		super(shape, config);
	}

}

class SphereCollider extends Collider {
    constructor(shape, config) {
        super(shape, config);

        // this.radius = config.scale;
    }
}

class PlaneCollider extends Collider {
    constructor(shape, config) {
        super(shape, config);
    }
}

class CollisionDetector {
	detectCollision(colliderA, colliderB, manifold) {
		throw new Error("Collision Detector: Inheritance Error");
	}
}

class SphereSphereCollisionDetector extends CollisionDetector {

	detectCollision(colliderA, colliderB, manifold) {

	}
}

class SpherePlaneCollisionDetector extends CollisionDetector {

    constructor(flip=false) {
        super();
        this.flip = flip;
    }

	detectCollision(colliderA, colliderB, manifold) {
        
	}
}

class Manifold {
    constructor(bodyA, bodyB) {
        this.bodyA = bodyA;
        this.bodyB = bodyB;

        // Furthest point of A into B
        this.maxA = undefined;

        // Furthest point of B into A
        this.maxB = undefined;

        // B - A normalized
        this.normal = undefined;

        // Length of B - A
        this.depth = 0;

        this.hasCollision = false;
    }
}

class World {
	constructor(params) {
		if (!(params instanceof Object)) params = {};

		this.timestep = params.timestep || 1 / 60;
		this.iterations = params.iterations || 8;

		this.scale = params.worldscale || 1;
		this.invScale = 1 / this.scale;

		// set gravity
		this.gravity = new Vec3(0, -9.8, 0);
		if (params.gravity !== undefined) this.gravity.fromArray(params.gravity);

		this.rigidbodies = [];

		this.detector = [{}, {}, {}, {}, {}];
		this.detector[SHAPE_SPHERE][SHAPE_SPHERE] = new SphereSphereCollisionDetector();
		this.detector[SHAPE_SPHERE][SHAPE_PLANE] = new SpherePlaneCollisionDetector();
		this.detector[SHAPE_PLANE][SHAPE_SPHERE] = new SpherePlaneCollisionDetector(true);
	}

	step() {
		// apply gravity force
		for (var i = 0; i < this.rigidbodies.length; i++) {
			var body = this.rigidbodies[i];
			if (body.move) {
				body.force.addScaledVector(this.gravity, body.mass);
			}
		}

		// resolve collisions
		this.resolveCollisions();

		// update velocity & position
		for (var i = 0; i < this.rigidbodies.length; i++) {
			var body = this.rigidbodies[i];
			if (body.move) {
				body.linearVelocity.addScaledVector(body.force, body.invMass * this.timestep);
				body.position.addScaledVector(body.linearVelocity, world.timestep);

				// reset force
				body.force.reset();
			}
		}
	}

	setGravity(grArr) {
		this.gravity.fromArray(grArr);
	}

	addRigidbody(bodyParams) {
		let collider = this._createCollider(bodyParams);
		if (collider == undefined) {
			console.error("Collider of shape: ", bodyParams.shape, " cannot be created");
			return;
		}

		let rb = new RigidBody(bodyParams);
		rb.addCollider(collider);

		this.rigidbodies.push(rb);
		return rb;
	}

	removeRigidbody() {
	}

	getNumRigidbodies() {
		return this.rigidbodies.length;
	}

	resolveCollisions() {
		var numBodies = this.rigidbodies.length;

		for (var i = 0; i < numBodies; i++) {
			for (var j = i+1; j < numBodies; j++) {
				var bodyA = this.rigidbodies[i];
				var bodyB = this.rigidbodies[j];

				var detector = this.detector[bodyA.collider.shape][bodyB.collider.shape];
				var manifold = new Manifold(bodyA, bodyB);

				detector.detectCollision(bodyA.collider, bodyB.collider, manifold);
				if (manifold.hasCollision) {
					console.log("Collision Detected: ", manifold);
				} else {
					console.log("No collision");
				}
			}
		}

		// solve collisions

		// impulse solver
		// position correction
	}

	_createCollider(config) {
		switch (config.shape) {
			case SHAPE_BOX:
				return new BoxCollider(SHAPE_BOX, config);
			case SHAPE_SPHERE:
				return new SphereCollider(SHAPE_SPHERE, config);
			case SHAPE_PLANE:
				return new PlaneCollider(SHAPE_PLANE, config);
		}
	}

}

export { AABB_PROX, BODY_DYNAMIC, BODY_KINEMATIC, BODY_STATIC, BR_BOUNDING_VOLUME_TREE, BR_BRUTE_FORCE, BR_NULL, BR_SWEEP_AND_PRUNE, RigidBody, SHAPE_BOX, SHAPE_CYLINDER, SHAPE_PLANE, SHAPE_POLYGON, SHAPE_SPHERE, Vec3, World };
