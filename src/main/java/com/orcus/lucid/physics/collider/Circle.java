package com.orcus.lucid.physics.collider;

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
}
