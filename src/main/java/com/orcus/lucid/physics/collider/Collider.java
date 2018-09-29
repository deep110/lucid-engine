package com.orcus.lucid.physics.collider;

import com.orcus.lucid.physics.RigidBody;

/**
 * @author Deepankar Agrawal
 */
public abstract class Collider {

    public abstract void computeMass(RigidBody rigidBody, float density);
}
