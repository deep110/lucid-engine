package com.orcus.lucid.physics;

import com.orcus.lucid.util.Vector2;

import java.util.ArrayList;

/**
 * @author Deepankar Agrawal
 * <p>
 * Here we will interface physics simulation and scene (which is renderer)
 */
public class World {

    public Vector2 gravity;
    public float timeStep;
    public int iterations;

    private ArrayList<RigidBody> rigidBodies;
    private ArrayList<Manifold> collisions;
    private CollisionManager collisionManager;


    public World(Vector2 gravity, float timeStep, int iterations) {
        this.gravity = gravity;
        this.timeStep = timeStep;
        this.iterations = iterations;
        this.collisionManager = CollisionManager.getInstance();

        this.rigidBodies = new ArrayList<>(4);
    }


    public void addRigidBody(RigidBody body) {
        rigidBodies.add(body);
    }

    public void removeRigidBody(RigidBody body) {
        rigidBodies.remove(body);
    }

    public ArrayList<RigidBody> getRigidBodies() {
        return rigidBodies;
    }

    public void update(float deltaTime) {
        // generate colliders for the current step
        generateCollisionInfo();
    }

    private void generateCollisionInfo() {
        // iterate over every body and save collision info to
        // manifold
        // it is also called broad-phase generation
        collisions.clear();

        for (int i = 0; i < rigidBodies.size(); ++i) {
            RigidBody A = rigidBodies.get(i);

            for (int j = i + 1; j < rigidBodies.size(); ++j) {
                RigidBody B = rigidBodies.get(j);

                // infinite mass objects don't move
                // so don't collide
                if (A.inverseMass == 0 && B.inverseMass == 0) {
                    continue;
                }

                Manifold m = new Manifold(A, B);
                collisionManager.handleCollision(m, A, B);

                if (m.contactCount > 0) {
                    collisions.add(m);
                }
            }
        }
    }

}
