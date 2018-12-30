package com.orcus.lucid.physics.collider;

import com.orcus.lucid.physics.RigidBody;
import com.orcus.lucid.util.Vector2;

import java.awt.*;
import java.awt.geom.Path2D;

/**
 * @author Deepankar Agrawal
 */
public class AABB extends Collider {

    public float width;
    public float height;

    private Vector2 renderPosition;

    public AABB(float width, float height) {
        this.width = width;
        this.height = height;

        renderPosition = new Vector2();
    }


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

        renderPosition.set(position).muli(renderScalingFactor);

        path.moveTo(renderPosition.x - halfWidth, renderPosition.y - halfHeight);
        path.lineTo(renderPosition.x + halfWidth, renderPosition.y - halfHeight);
        path.lineTo(renderPosition.x + halfWidth, renderPosition.y + halfHeight);
        path.lineTo(renderPosition.x - halfWidth, renderPosition.y + halfHeight);

        path.closePath();

        gr.setColor(Color.blue);
        gr.draw(path);
    }
}
