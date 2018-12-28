package com.orcus.lucid.physics;

import com.orcus.lucid.util.Vector2;

import java.util.ArrayList;

/**
 * @author Deepankar Agrawal
 * <p>
 * Here we will interface physics simulation and scene (which is renderer)
 * <p>
 * Mainly simulation consists of three steps
 * 1. Calculate colliding pairs of rigidbodies i.e BroadPhase calculation
 * 2. Use Semi-implicit (Symplectic) euler to apply forces
 * v += (1/m * F) * dt
 * x += v * dt
 * 3. Impulse Resolution using momentum conversation (@link com.orcus.lucid.physics.Manifold.java)
 * - Takes translational force and gravity
 * - Takes rotational torque
 * - Takes static and dynamic friction
 */
public class World {

    public Vector2 gravity;
    public float timeStep;
    public int iterations;

    private ArrayList<RigidBody> rigidBodies;
    private ArrayList<Manifold> manifolds;
    private CollisionManager collisionManager;


    public World(Vector2 gravity, float timeStep, int iterations) {
        this.gravity = gravity;
        this.timeStep = timeStep;
        this.iterations = iterations;
        this.collisionManager = CollisionManager.getInstance();

        this.rigidBodies = new ArrayList<>(4);
        this.manifolds = new ArrayList<>();
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

        // Integrate acceleration
        for (RigidBody rigidBody : rigidBodies) {
            integrateAcceleration(rigidBody, deltaTime);
        }

        // Initialize collision
        for (Manifold manifold : manifolds) {
            manifold.initialize();
        }

        // Solve collisions
        for (int j = 0; j < iterations; ++j) {
            for (Manifold manifold : manifolds) {
                manifold.applyImpulse();
            }
        }

        // Integrate velocities
        for (RigidBody rigidBody : rigidBodies) {
            integrateVelocity(rigidBody, deltaTime);
        }

        // Correct positions
        for (Manifold manifold : manifolds) {
            manifold.positionalCorrection();
        }

        // Clear all forces
        for (RigidBody b : rigidBodies) {
            b.force.set(0, 0);
            b.torque = 0;
        }
    }

    private void generateCollisionInfo() {
        // iterate over every body and save collision info to
        // manifold
        // it is also called broad-phase generation
        manifolds.clear();

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
                    manifolds.add(m);
                }
            }
        }
    }

    private void integrateAcceleration(RigidBody body, float dt) {

        if (body.inverseMass == 0) {
            return;
        }

        // v += (1/m * F) * dt
        body.velocity.addsi(body.force, body.inverseMass * dt);
        body.velocity.addsi(gravity, dt);
    }

    private void integrateVelocity(RigidBody b, float dt) {

        if (b.inverseMass == 0.0f) {
            return;
        }

        // x += v * dt
        b.position.addsi(b.velocity, dt);
        b.orientation += b.angularVelocity * dt;

        integrateAcceleration(b, dt);
    }

}
