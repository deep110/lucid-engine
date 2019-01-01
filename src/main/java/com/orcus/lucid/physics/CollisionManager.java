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
        Circle B = (Circle) b.collider;

        float radius = A.radius + B.radius;
        Vector2 normal = (b.position.sub(a.position));
        m.contactCount = 0;

        // rigidbodies are not touching
        if (normal.lengthSq() > radius * radius) {
            return;
        }

        float distance = normal.length();
        m.contactCount = 1;

        // circles overlap i.e on same position
        if (distance == 0.0f) {
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
        Circle A = (Circle) a.collider;
        AABB B = (AABB) b.collider;

        Vector2 n = b.position.sub(a.position);

        // Closest point on B to center of A
        Vector2 closest = new Vector2(n);

        // Calculate half extents along each axis
        float x_extent = B.width / 2;
        float y_extent = B.height / 2;

        // Clamp point to edges of the AABB
        closest.x = Mathf.clamp(-x_extent, x_extent, closest.x);
        closest.y = Mathf.clamp(-y_extent, y_extent, closest.y);

        boolean inside = false;

        // Circle is inside the AABB, so we need to clamp the circle's center
        // to the closest edge
        if (n == closest) {
            inside = true;

            // Find closest axis
            if (StrictMath.abs(n.x) > StrictMath.abs(n.y)) {
                // Clamp to closest extent
                if (closest.x > 0)
                    closest.x = x_extent;
                else
                    closest.x = -x_extent;
            }

            // y axis is shorter
            else {
                // Clamp to closest extent
                if (closest.y > 0)
                    closest.y = y_extent;
                else
                    closest.y = -y_extent;
            }
        }

        Vector2 normal = n.sub(closest);
        float d = normal.lengthSq();
        float r = A.radius;

        // Early out of the radius is shorter than distance to closest point and
        // Circle not inside the AABB
        if (d > r * r && !inside) {
            return;
        }
        m.contactCount = 1;
        // Avoided sqrt until we needed
        d = (float) StrictMath.sqrt(d);

        // Collision normal needs to be flipped to point outside if circle was
        // inside the AABB
        m.collisionNormal.set((inside) ? n.mul(-1): n);
        m.penetrationDepth = r - d;
        m.contacts[0].set(a.position).addsi(m.collisionNormal, A.radius);
    }

    private void collisionAABBAABB(Manifold m, RigidBody a, RigidBody b) {
        AABB A = (AABB) a.collider;
        AABB B = (AABB) b.collider;

        m.contactCount = 0;

        Vector2 n = b.position.sub(a.position);

        // Calculate overlap on x axis (SAT test on x axis)
        float x_overlap = A.width / 2 + B.width / 2 - StrictMath.abs(n.x);

        if (x_overlap > 0) {
            // Calculate overlap on y axis
            float y_overlap = A.height / 2 + B.height / 2 - StrictMath.abs(n.y);

            // SAT test on y axis
            if (y_overlap > 0) {
                m.contactCount = 1;
                float sign;

                // Find out which axis is axis of least penetration
                if (x_overlap < y_overlap) {
                    // Point towards B knowing that n points from A to B
                    sign = Mathf.sign(n.x);
                    m.collisionNormal.set(sign, 0);
                    m.penetrationDepth = x_overlap;
                } else {
                    // Point toward B knowing that n points from A to B
                    sign = Mathf.sign(n.y);
                    m.collisionNormal.set(0, sign);
                    m.penetrationDepth = y_overlap;
                }

                // A->position + sign(B-A) * [(w/2, h/2) - normal * pDepth]
                m.contacts[0].set(a.position)
                        .addsi(new Vector2(A.width/2, A.height/2)
                        .subsi(m.collisionNormal, m.penetrationDepth), sign);
            }
        }
    }

}
