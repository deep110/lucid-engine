package com.orcus.lucid.physics;

import com.orcus.lucid.physics.collider.Circle;
import com.orcus.lucid.physics.collider.Polygon;
import com.orcus.lucid.util.Vector2;

/**
 * @author Deepankar Agrawal
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
        } else if (a.collider instanceof Polygon && b.collider instanceof Polygon) {
            collisionPolygonPolygon(m, a, b);
        } else if (a.collider instanceof Circle && b.collider instanceof Polygon) {
            collisionCirclePolygon(m, a, b);
        } else {
            collisionCirclePolygon(m, b, a);
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
            m.contacts[0].set(m.collisionNormal.muli(A.radius).addi(a.position));
        }
    }

    private void collisionCirclePolygon(Manifold m, RigidBody a, RigidBody b) {

    }

    private void collisionPolygonPolygon(Manifold m, RigidBody a, RigidBody b) {

    }

}
