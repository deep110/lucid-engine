package com.orcus.lucid.physics.collider;

import com.orcus.lucid.physics.RigidBody;

import java.awt.*;
import java.awt.geom.Path2D;

/**
 * @author Deepankar Agrawal
 */
public class AABB extends Collider {

    public float width;
    public float height;


    @Override
    public void computeMass(RigidBody rigidBody, float density) {
        rigidBody.mass = width * height * density;
        rigidBody.inverseMass = (rigidBody.mass != 0.0f) ? 1.0f / rigidBody.mass : 0.0f;
        rigidBody.inertia = rigidBody.mass * (width * width + height * height) / 12;
        rigidBody.inverseInertia = (rigidBody.inertia != 0.0f) ? 1.0f / rigidBody.inertia : 0.0f;
    }

    @Override
    public void render(Graphics2D gr, float renderScalingFactor) {
        Path2D.Float path = new Path2D.Float();

        float halfWidth = width / 2 * renderScalingFactor;
        float halfHeight = height / 2 * renderScalingFactor;

        path.moveTo(position.x - halfWidth, position.y - halfHeight);
        path.lineTo(position.x + halfWidth, position.y - halfHeight);
        path.lineTo(position.x + halfWidth, position.y + halfHeight);
        path.lineTo(position.x - halfWidth, position.y + halfHeight);

        path.closePath();

        gr.setColor(Color.blue);
        gr.draw(path);
    }
}
