package com.orcus.lucid;

import com.orcus.lucid.physics.Material;
import com.orcus.lucid.physics.Mathf;
import com.orcus.lucid.physics.RigidBody;
import com.orcus.lucid.physics.World;
import com.orcus.lucid.physics.collider.AABB;
import com.orcus.lucid.physics.collider.Circle;
import com.orcus.lucid.render.Scene;
import com.orcus.lucid.render.input.GameInput;
import com.orcus.lucid.util.Vector2;

import java.awt.event.KeyEvent;
import java.awt.event.MouseEvent;

/**
 * @author Deepankar Agrawal
 */
public class TestScene extends Scene {

    private boolean playing = true;

    public TestScene(int width, int height, World world) {
        super(width, height, world);
    }

    @Override
    public void start() {
        RigidBody b = new RigidBody(
                new AABB(5f, 0.5f),
                new Material(0.6f, 0.1f, 0.3f, 0.8f), // rock
                renderToWorldCoordinate(new Vector2(346, 516))
        );
        b.setStatic();
        physicsWorld.addRigidBody(b);

        RigidBody b2 = new RigidBody(
                new Circle(0.1f),
                new Material(0.6f, 0.1f), // rock
                renderToWorldCoordinate(new Vector2(346, 216))
        );
        b2.setStatic();
        physicsWorld.addRigidBody(b2);
    }

    @Override
    public void update(GameInput input, float deltaTime) {

        if (input.keyDown[KeyEvent.VK_ESCAPE]) {
            playing = false;
        }

        // remove out of bounds bodies
        physicsWorld.getRigidBodies().removeIf(this::isBodyOutOfScreen);

        if (input.mouseUp[MouseEvent.BUTTON1]) {
            float hw = Mathf.random(0.2f, 0.6f);
            float hh = Mathf.random(0.2f, 0.6f);
            physicsWorld.addRigidBody(
                    new RigidBody(
                            new AABB(hw, hh),
                            new Material(0.6f, 0.1f), // rock
                            renderToWorldCoordinate(new Vector2(input.mouseX, input.mouseY))
                    )
            );
        }
        if (input.mouseUp[MouseEvent.BUTTON3]) {
            physicsWorld.addRigidBody(
                    new RigidBody(
                            new Circle(Mathf.random(0.1f, 0.4f)),
                            new Material(0.6f, 0.1f), // wood
                            renderToWorldCoordinate(new Vector2(input.mouseX, input.mouseY))
                    )
            );
        }
    }

    @Override
    public void destroy() {

    }

    @Override
    public boolean isPlaying() {
        return playing;
    }
}
