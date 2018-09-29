package com.orcus.lucid.physics;

import com.orcus.lucid.physics.collider.Collider;
import com.orcus.lucid.util.Vector2;

/**
 * @author Deepankar Agrawal
 */
public class RigidBody {

    public final Vector2 position = new Vector2();
    public final Vector2 velocity = new Vector2();
    public final Vector2 force = new Vector2();

    public float angularVelocity;
    public float torque;
    public float mass, inverseMass, inertia, inverseInertia;
    public boolean isStatic;

    public final Material material;
    public final Collider collider;

    public RigidBody(Collider collider, Material material, int x, int y) {
        this.collider = collider;
        this.material = material;

        this.position.set(x, y);
        this.velocity.set(0, 0);
        this.force.set(0, 0);

        this.angularVelocity = 0;
        this.torque = 0;

        this.isStatic = false;
        this.collider.computeMass(this, material.density);
    }

    public void setStatic() {
        isStatic = true; // means body will not move and will have infinite mass

        // inverse masses will take care for the infinity mass
        inertia = inverseInertia = mass = inverseMass = 0;
    }

    public void addForce(Vector2 force) {
        this.force.addi(force);
    }

    public void addImpulse() {

    }

}
