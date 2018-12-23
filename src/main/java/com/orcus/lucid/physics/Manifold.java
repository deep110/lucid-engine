package com.orcus.lucid.physics;

import com.orcus.lucid.util.Vector2;

/**
 * @author Deepankar Agrawal
 * <p>
 * Stores collision data between two rigidbodies
 * </p>
 */
public class Manifold {

    // normal direction rigidbodies when they collide
    public Vector2 collisionNormal;

    public float penetrationDepth;

    // no of points of contact, when rigidbodies collide
    public int contactCount;

    // actual vectors of contact points
    // at most there can be two points
    public Vector2[] contacts = {new Vector2(), new Vector2()};

    private RigidBody A, B;

    public Manifold(RigidBody A, RigidBody B) {
        this.A = A;
        this.B = B;

        this.collisionNormal = new Vector2();
        this.contactCount = 0;
    }
}
