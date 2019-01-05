package com.orcus.lucid.physics;

import com.orcus.lucid.util.Vector2;

/**
 * @author Deepankar Agrawal
 * <p>
 * Stores collision data between two rigidbodies
 * </p>
 */
public class Manifold {

    private static final float PENETRATION_ALLOWANCE = 0.05f;
    private static final float PENETRATION_CORRECTION = 0.4f;

    // normal direction rigidbodies when they collide
    public Vector2 collisionNormal;

    public float penetrationDepth;

    // no of points of contact, when rigidbodies collide
    public int contactCount;

    // actual vectors of contact points
    // at most there can be two points
    public Vector2[] contacts = {new Vector2(), new Vector2()};

    private RigidBody A, B;
    private float e;

    public Manifold(RigidBody A, RigidBody B) {
        this.A = A;
        this.B = B;

        this.collisionNormal = new Vector2();
        this.contactCount = 0;
    }

    public void initialize() {
        // Calculate average restitution
        e = StrictMath.min(A.material.restitution, B.material.restitution);

        for (int i = 0; i < contactCount; ++i) {

            Vector2 rv = B.velocity.sub(A.velocity);

            // Determine if we should perform a resting collision or not
            // The idea is if the only thing moving this object is gravity,
            // then the collision should be performed without any restitution
            // if(rv.LenSqr() < (dt * gravity).LenSqr() + EPSILON)
            if (rv.lengthSq() < Mathf.RESTING) {
                e = 0.0f;
            }
        }
    }

    public void applyImpulse() {
        // if masses are infinite set velocity 0 and return
        if (Mathf.equal(A.inverseMass + B.inverseMass, 0)) {
            A.velocity.set(0, 0);
            B.velocity.set(0, 0);
            return;
        }

        for (int i = 0; i < contactCount; ++i) {
            // contact direction from COM (Center of Mass)
            Vector2 ra = contacts[i].sub(A.position);
            Vector2 rb = contacts[i].sub(B.position);

            // Relative velocity
            Vector2 rv = B.velocity.sub(A.velocity);

            // Relative velocity along the normal
            float contactVel = Vector2.dot(rv, collisionNormal);

            // Do not resolve if velocities are separating
            if (contactVel > 0) {
                return;
            }

            float invMassSum = A.inverseMass + B.inverseMass;

            // Calculate impulse scalar
            float j = -(1.0f + e) * contactVel;
            j /= invMassSum;
            j /= contactCount;

            // Apply impulse
            Vector2 impulse = collisionNormal.mul(j);
            A.addImpulse(impulse.neg(), ra);
            B.addImpulse(impulse, rb);

            // TODO: apply friction
            // TODO: add rotation
        }

    }

    public void positionalCorrection() {

        // only do correction when penetration depth > penetration allowance
        float correction = StrictMath.max(
                penetrationDepth - PENETRATION_ALLOWANCE, 0.0f
        ) / (A.inverseMass + B.inverseMass) * PENETRATION_CORRECTION;

        A.position.addsi(collisionNormal, -A.inverseMass * correction);
        B.position.addsi(collisionNormal, B.inverseMass * correction);
    }

}
