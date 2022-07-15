// Body type
var BODY_NULL = 0;
var BODY_DYNAMIC = 1;
var BODY_STATIC = 2;
var BODY_KINEMATIC = 3;
var BODY_GHOST = 4;

// Shape type
var SHAPE_NULL = 0;
var SHAPE_SPHERE = 1;
var SHAPE_BOX = 2;
var SHAPE_CYLINDER = 3;
var SHAPE_PLANE = 4;
var SHAPE_PARTICLE = 5;
var SHAPE_TETRA = 6;

// Joint type
var JOINT_NULL = 0;
var JOINT_DISTANCE = 1;
var JOINT_BALL_AND_SOCKET = 2;
var JOINT_HINGE = 3;
var JOINT_WHEEL = 4;
var JOINT_SLIDER = 5;
var JOINT_PRISMATIC = 6;

// BroadPhase
var BR_NULL = 0;
var BR_BRUTE_FORCE = 1;
var BR_SWEEP_AND_PRUNE = 2;
var BR_BOUNDING_VOLUME_TREE = 3;

// AABB approximation
var AABB_PROX = 0.005;

class Vec3 {
    constructor(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }
}

class Shape {
    constructor() {
        this.test = 0;
    }
}

class RigidBody {
    constructor() {

    }
}

class World {
    constructor() {

    }
}

export { AABB_PROX, BODY_DYNAMIC, BODY_GHOST, BODY_KINEMATIC, BODY_NULL, BODY_STATIC, BR_BOUNDING_VOLUME_TREE, BR_BRUTE_FORCE, BR_NULL, BR_SWEEP_AND_PRUNE, JOINT_BALL_AND_SOCKET, JOINT_DISTANCE, JOINT_HINGE, JOINT_NULL, JOINT_PRISMATIC, JOINT_SLIDER, JOINT_WHEEL, RigidBody, SHAPE_BOX, SHAPE_CYLINDER, SHAPE_NULL, SHAPE_PARTICLE, SHAPE_PLANE, SHAPE_SPHERE, SHAPE_TETRA, Shape, Vec3, World };
