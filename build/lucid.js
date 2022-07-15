(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Lucid = {}));
})(this, (function (exports) { 'use strict';

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

    exports.AABB_PROX = AABB_PROX;
    exports.BODY_DYNAMIC = BODY_DYNAMIC;
    exports.BODY_GHOST = BODY_GHOST;
    exports.BODY_KINEMATIC = BODY_KINEMATIC;
    exports.BODY_NULL = BODY_NULL;
    exports.BODY_STATIC = BODY_STATIC;
    exports.BR_BOUNDING_VOLUME_TREE = BR_BOUNDING_VOLUME_TREE;
    exports.BR_BRUTE_FORCE = BR_BRUTE_FORCE;
    exports.BR_NULL = BR_NULL;
    exports.BR_SWEEP_AND_PRUNE = BR_SWEEP_AND_PRUNE;
    exports.JOINT_BALL_AND_SOCKET = JOINT_BALL_AND_SOCKET;
    exports.JOINT_DISTANCE = JOINT_DISTANCE;
    exports.JOINT_HINGE = JOINT_HINGE;
    exports.JOINT_NULL = JOINT_NULL;
    exports.JOINT_PRISMATIC = JOINT_PRISMATIC;
    exports.JOINT_SLIDER = JOINT_SLIDER;
    exports.JOINT_WHEEL = JOINT_WHEEL;
    exports.RigidBody = RigidBody;
    exports.SHAPE_BOX = SHAPE_BOX;
    exports.SHAPE_CYLINDER = SHAPE_CYLINDER;
    exports.SHAPE_NULL = SHAPE_NULL;
    exports.SHAPE_PARTICLE = SHAPE_PARTICLE;
    exports.SHAPE_PLANE = SHAPE_PLANE;
    exports.SHAPE_SPHERE = SHAPE_SPHERE;
    exports.SHAPE_TETRA = SHAPE_TETRA;
    exports.Shape = Shape;
    exports.Vec3 = Vec3;
    exports.World = World;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
