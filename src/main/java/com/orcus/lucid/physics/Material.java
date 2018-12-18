package com.orcus.lucid.physics;

/**
 * @author Deepankar Agrawal
 */
public class Material {

    public float staticFriction;
    public float dynamicFriction;
    public float restitution;
    public float density;

    public Material() {
        staticFriction = 0;
        dynamicFriction = 0;
        restitution = 1;
        density = 0.6f;
    }
}
