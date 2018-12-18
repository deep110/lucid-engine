package com.orcus.lucid;

import com.orcus.lucid.physics.Material;
import com.orcus.lucid.physics.RigidBody;
import com.orcus.lucid.physics.World;
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
//        impulse = new ImpulseScene(ImpulseMath.DT, 10);
//
//        Body b = null;
//
//        b = impulse.add(new Circle(30.0f), 200, 200);
//        b.setStatic();
//
//        b = impulse.add(new Polygon(200.0f, 10.0f), 240, 300);
//        b.setStatic();
//        b.setOrient(0);
//
//        accumulator = 0f;
    }

    @Override
    public void update(GameInput input, float deltaTime) {

        if (input.keyDown[KeyEvent.VK_ESCAPE]) {
            playing = false;
        }

        if (input.mouseUp[MouseEvent.BUTTON1]) {
            RigidBody b = new RigidBody(
                    new Circle(0.1f),
                    new Material(),
                    new Vector2(input.mouseX/METER_TO_PIXEL_MULTIPLIER, input.mouseY/METER_TO_PIXEL_MULTIPLIER)
            );
            System.out.println(input.mouseX +"/"+ input.mouseY);
            physicsWorld.addRigidBody(b);
        }

//        if (input.keyDown[KeyEvent.VK_SHIFT]) {
//            if (input.mouseUp[MouseEvent.BUTTON1]) {
//                float hw = ImpulseMath.random(10.0f, 30.0f);
//                float hh = ImpulseMath.random(10.0f, 30.0f);
//
//                Body b = impulse.add(new Polygon(hw, hh), input.mouseX, input.mouseY);
//                b.setOrient(0.0f);
//            }
//        } else {
//            if (input.mouseUp[MouseEvent.BUTTON1]) {
//                float r = ImpulseMath.random(10.0f, 50.0f);
//                int vertCount = ImpulseMath.random(3, Polygon.MAX_POLY_VERTEX_COUNT);
//
//                Vector2[] verts = Vector2.arrayOf(vertCount);
//                for (int i = 0; i < vertCount; i++) {
//                    verts[i].set(ImpulseMath.random(-r, r), ImpulseMath.random(-r, r));
//                }
//
//                Body b = impulse.add(new Polygon(verts), input.mouseX, input.mouseY);
//                b.setOrient(ImpulseMath.random(-ImpulseMath.PI, ImpulseMath.PI));
//                b.restitution = 0.2f;
//                b.dynamicFriction = 0.2f;
//                b.staticFriction = 0.4f;
//            }
//            if (input.mouseUp[MouseEvent.BUTTON3]) {
//                float r = ImpulseMath.random(10.0f, 30.0f);
//
//                impulse.add(new Circle(r), input.mouseX, input.mouseY);
//            }
//        }

//        accumulator += state.seconds;
//
//        if (accumulator >= impulse.dt) {
//            impulse.step();
//
//            accumulator -= impulse.dt;
//        }
    }

    @Override
    public void destroy() {

    }

    @Override
    public boolean isPlaying() {
        return playing;
    }

}
