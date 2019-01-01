package com.orcus.lucid.physics;

import com.orcus.lucid.physics.collider.Collider;
import com.orcus.lucid.util.Vector2;

/**
 * @author Deepankar Agrawal
 */
public class RigidBody {

    // translational components
    public final Vector2 position = new Vector2();
    public final Vector2 velocity = new Vector2();
    public final Vector2 force = new Vector2();

    // rotational components
    public float orientation; // in radians
    public float angularVelocity;
    public float torque;

    public float mass, inverseMass, inertia, inverseInertia;
    public boolean isStatic;

    public final Material material;
    public final Collider collider;

    public RigidBody(Collider collider, Material material, Vector2 position) {
        this.collider = collider;
        this.material = material;

        this.position.set(position);
        this.velocity.set(0, 0);
        this.force.set(0, 0);

        this.orientation = 0;
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

    public void applyForce(Vector2 force) {
        this.force.addi(force);
    }

    public void addImpulse(Vector2 impulse, Vector2 contactVector) {

        // V = V + (j ∗ n) / mass
        // impulse or momentum
        // to see derivation:
        // https://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-the-basics-and-impulse-resolution--gamedev-6331

        velocity.addsi(impulse, inverseMass);
        angularVelocity += inverseInertia * Vector2.cross(contactVector, impulse);
    }

}
