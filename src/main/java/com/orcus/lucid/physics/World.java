package com.orcus.lucid.physics;

import com.orcus.lucid.util.Vector2;

import java.util.ArrayList;

/**
 * @author Deepankar Agrawal
 *
 * Here we will interface physics simulation and scene (which is renderer)
 */
public class World {

    private Vector2 gravity;
    private float timeStep;
    private ArrayList<RigidBody> rigidBodies;


    public World(Vector2 gravity, float timeStep) {
        this.gravity = gravity;
        this.timeStep = timeStep;

        this.rigidBodies = new ArrayList<>(4);
    }


    public void addRigidBody(RigidBody body) {
        rigidBodies.add(body);
    }

    public void removeRigidBody(RigidBody body) {
        rigidBodies.remove(body);
    }

    public ArrayList<RigidBody> getRigidbodies() {
        return rigidBodies;
    }

    public float getTimeStep() {
        return this.timeStep;
    }

    public void update() {
        // TODO: run the physics simulation
    }

}
