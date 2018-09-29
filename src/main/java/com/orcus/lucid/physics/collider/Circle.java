package com.orcus.lucid.physics.collider;

import com.orcus.lucid.physics.Mathf;
import com.orcus.lucid.physics.RigidBody;
import com.orcus.lucid.util.Vector2;

/**
 * @author Deepankar Agrawal
 */
public class Circle extends Collider {

    public Vector2 position;
    public float radius;

    public Circle(Vector2 position, float radius) {
        this.position = position;
        this.radius = radius;
    }

    @Override
    public void computeMass(RigidBody rigidBody, float density) {
        rigidBody.mass = Mathf.PI * radius * radius * density;
        rigidBody.inverseMass = (rigidBody.mass != 0.0f) ? 1.0f / rigidBody.mass : 0.0f;
        rigidBody.inertia = rigidBody.mass * radius * radius;
        rigidBody.inverseInertia = (rigidBody.inertia != 0.0f) ? 1.0f / rigidBody.inertia : 0.0f;
    }
}
