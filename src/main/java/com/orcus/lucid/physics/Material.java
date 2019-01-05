package com.orcus.lucid.physics;

/**
 * @author Deepankar Agrawal
 *
 *
 * Defines property of the rigidbody. Different materials have different coefficients
 * for these properties.
 *
 * Density affects mass. A density of 0 means immovable object (infinite mass).
 *
 * Rock       Density : 0.6  Restitution : 0.1
 * Wood       Density : 0.3  Restitution : 0.2
 * Metal      Density : 1.2  Restitution : 0.05
 * BouncyBall Density : 0.3  Restitution : 0.8
 * SuperBall  Density : 0.3  Restitution : 0.95
 * Pillow     Density : 0.1  Restitution : 0.2
 * Static     Density : 0.0  Restitution : 0.4
 *
 */
public class Material {

    public float staticFriction;
    public float dynamicFriction;
    public float restitution;
    public float density;

    public Material(float density, float restitution, float staticFriction, float dynamicFriction) {
        this.density = density;
        this.restitution = restitution;
        this.dynamicFriction = dynamicFriction;
        this.staticFriction = staticFriction;
    }

    public Material(float density, float restitution) {
        this(density, restitution, 0.1f, 0.1f);
    }

    public Material() {
        this(0.6f, 1);
    }
}
