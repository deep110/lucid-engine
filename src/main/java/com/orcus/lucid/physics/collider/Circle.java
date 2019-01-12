package com.orcus.lucid.physics.collider;

import com.orcus.lucid.physics.Mathf;
import com.orcus.lucid.physics.RigidBody;

import java.awt.*;
import java.awt.geom.Ellipse2D;
import java.awt.geom.Line2D;

/**
 * @author Deepankar Agrawal
 */
public class Circle extends Collider {

    public float radius;

    public Circle(float radius) {
        this.radius = radius;
    }

    @Override
    public void computeMass(RigidBody rigidBody, float density) {
        rigidBody.mass = Mathf.PI * radius * radius * density;
        rigidBody.inverseMass = (rigidBody.mass != 0.0f) ? 1.0f / rigidBody.mass : 0.0f;
        rigidBody.inertia = rigidBody.mass * radius * radius;
        rigidBody.inverseInertia = (rigidBody.inertia != 0.0f) ? 1.0f / rigidBody.inertia : 0.0f;
    }

    @Override
    public void render(RigidBody rigidBody, Graphics2D gr, float renderScalingFactor) {
        float rx = (float) StrictMath.cos(rigidBody.orientation) * radius;
        float ry = (float) StrictMath.sin(rigidBody.orientation) * radius;
        gr.setColor(Color.red);
        gr.draw(new Ellipse2D.Float(
                        (rigidBody.position.x - radius) * renderScalingFactor,
                        (rigidBody.position.y - radius) * renderScalingFactor,
                        radius * 2 * renderScalingFactor,
                        radius * 2 * renderScalingFactor
                )
        );
        gr.draw(new Line2D.Float(
                        rigidBody.position.x * renderScalingFactor,
                        rigidBody.position.y * renderScalingFactor,
                        (rigidBody.position.x + rx) * renderScalingFactor,
                        (rigidBody.position.y + ry) * renderScalingFactor
                )
        );
    }

    @Override
    public String toString() {
        return Float.toString(radius);
    }
}
