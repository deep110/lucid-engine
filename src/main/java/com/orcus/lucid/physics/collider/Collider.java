package com.orcus.lucid.physics.collider;

import com.orcus.lucid.physics.RigidBody;
import com.orcus.lucid.util.Vector2;

/**
 * @author Deepankar Agrawal
 */
public abstract class Collider {

    public Vector2 position;

    public abstract void computeMass(RigidBody rigidBody, float density);
}
