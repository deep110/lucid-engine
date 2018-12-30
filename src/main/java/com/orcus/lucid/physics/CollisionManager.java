package com.orcus.lucid.physics;

import com.orcus.lucid.physics.collider.AABB;
import com.orcus.lucid.physics.collider.Circle;
import com.orcus.lucid.util.Vector2;

/**
 * @author Deepankar Agrawal
 * <p>
 * Helper class for resolving collisions between colliders
 * <p>
 * Resolving collisions involves two things:
 * 1. check if two colliders are touching or not
 * 2. If yes fill the manifold with following three info:
 * - contactCount     : number of points of contact
 * - penetrationDepth : how far body is inside another (ideally should be near 0)
 * - collisionNormal  : normal direction of collision
 * - contacts         : coordinates of contact points
 */
public class CollisionManager {

    private static CollisionManager collisionManager;

    public static CollisionManager getInstance() {
        if (collisionManager == null) collisionManager = new CollisionManager();
        return collisionManager;
    }

    private CollisionManager() {
    }

    public void handleCollision(Manifold m, RigidBody a, RigidBody b) {
        if (a.collider instanceof Circle && b.collider instanceof Circle) {
            collisionCircleCircle(m, a, b);
        } else if (a.collider instanceof AABB && b.collider instanceof AABB) {
            collisionAABBAABB(m, a, b);
        } else if (a.collider instanceof Circle && b.collider instanceof AABB) {
            collisionCircleAABB(m, a, b);
        } else {
            collisionCircleAABB(m, b, a);
        }
    }

    private void collisionCircleCircle(Manifold m, RigidBody a, RigidBody b) {
        Circle A = (Circle) a.collider;
        Circle B = (Circle) a.collider;

        float radius = A.radius + B.radius;
        Vector2 normal = (a.position.sub(b.position));

        if (normal.lengthSq() > radius * radius) {
            m.contactCount = 0; // rigidbodies are not touching
            return;
        }

        float distance = normal.length();
        m.contactCount = 1;

        if (distance == 0.0f) { // circles overlap i.e on same position
            m.penetrationDepth = A.radius;

            // set any value
            // this case should not ideally occur
            m.collisionNormal.set(1.0f, 0.0f);
            m.contacts[0].set(a.position);
        } else {
            m.penetrationDepth = radius - distance;
            m.collisionNormal.set(normal.div(distance));
            m.contacts[0].set(m.collisionNormal.mul(A.radius).addi(a.position));
        }
    }


    private void collisionCircleAABB(Manifold m, RigidBody a, RigidBody b) {

    }

    private void collisionAABBAABB(Manifold m, RigidBody a, RigidBody b) {
        AABB A = (AABB) a.collider;
        AABB B = (AABB) b.collider;

        m.contactCount = 0;

        Vector2 n = B.position.sub(A.position);

        // Calculate overlap on x axis (SAT test on x axis)
        float x_overlap = A.width / 2 + B.width / 2 - StrictMath.abs(n.x);

        if (x_overlap > 0) {
            // Calculate overlap on y axis
            float y_overlap = A.height / 2 + B.height / 2 - StrictMath.abs(n.y);

            // SAT test on y axis
            if (y_overlap > 0) {
                m.contactCount = 2;
                m.contacts[0] = new Vector2(A.position.x + A.width / 2 - x_overlap, A.position.y + A.height / 2);
                m.contacts[1] = new Vector2(A.position.x + A.width / 2, A.position.y + A.height / 2 - y_overlap);

                // Find out which axis is axis of least penetration
                if (x_overlap > y_overlap) {
                    // Point towards B knowing that n points from A to B
                    if (n.x < 0)
                        m.collisionNormal = new Vector2(-1, 0);
                    else
                        m.collisionNormal = new Vector2(0, 0);
                    m.penetrationDepth = x_overlap;
                } else {
                    // Point toward B knowing that n points from A to B
                    if (n.y < 0)
                        m.collisionNormal = new Vector2(0, -1);
                    else
                        m.collisionNormal = new Vector2(0, 1);
                    m.penetrationDepth = y_overlap;
                }
            }
        }
    }

}
