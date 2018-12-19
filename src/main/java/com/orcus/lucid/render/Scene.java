package com.orcus.lucid.render;

import com.orcus.lucid.physics.RigidBody;
import com.orcus.lucid.physics.World;
import com.orcus.lucid.physics.collider.Circle;
import com.orcus.lucid.physics.collider.Collider;
import com.orcus.lucid.physics.collider.Polygon;
import com.orcus.lucid.render.input.GameInput;
import com.orcus.lucid.render.loop.GameLoop;
import com.orcus.lucid.render.loop.GameLoopFixed;
import com.orcus.lucid.util.Vector2;

import java.awt.*;
import java.awt.geom.Ellipse2D;


public abstract class Scene {

    public static final float METER_TO_PIXEL_MULTIPLIER = 100;

    protected final Camera camera;
    protected World physicsWorld;

    private int width, height;
    private GameScreen gameScreen;
    private GameLoop gameLoop;

    public Scene(int width, int height, World world) {
        this.width = width;
        this.height = height;
        this.camera = new Camera(width, height);
        this.gameLoop = new GameLoopFixed(3, world.getTimeStep(), 1/20);
        this.gameScreen = new GameScreen(width, height, true);
        this.physicsWorld = world;
    }

    public void showWindow(String title) {
        Graphics2D graphics = gameScreen.start(title);
        GameInput gameInput = gameScreen.getInput();

        GameState gameState = new GameState();
        gameLoop.onStart(this, gameState);

        start(); // call start
        renderInternal(gameState, graphics); // render once

        while (isPlaying()) {
            gameLoop.onLoop(this, gameState, gameInput, graphics);
        }

        // call destroy
        destroy();

        System.exit(0);
    }

    public Vector2 getWorldCoordinate(Vector2 mouse, Vector2 out) {
        return getWorldCoordinate(mouse.x, mouse.y, out);
    }

    public Vector2 getWorldCoordinate(float mouseX, float mouseY, Vector2 out) {
        out.x = camera.bounds.left + camera.bounds.getWidth() * mouseX / width;
        out.y = camera.bounds.top + camera.bounds.getHeight() * mouseY / height;

        return out;
    }

    // ------------------------------------------------------------------
    // private methods

    public void updateInternal(GameInput input, float deltaTime) {
        camera.update();
        update(input, deltaTime);
        physicsWorld.update(deltaTime);

        input.clear();
    }

    public void renderInternal(GameState state, Graphics2D gr) {
        camera.draw(state, gr);

        for (RigidBody b : physicsWorld.getRigidbodies()) {
            Collider c = b.collider;
            if (c instanceof Circle) {
                drawCircle((Circle) c, gr);
            } else if (c instanceof Polygon) {
                drawPolygon((Polygon) c, gr);
            }
        }

        // display graphics to screen
        gameScreen.update();
    }

    private void drawCircle(Circle circle, Graphics2D gr) {
//        float rx = (float) StrictMath.cos(b.orient) * circle.radius;
//        float ry = (float) StrictMath.sin(b.orient) * circle.radius;
        gr.setColor(Color.red);
        gr.draw(new Ellipse2D.Float(
                (circle.position.x - circle.radius) * METER_TO_PIXEL_MULTIPLIER,
                (circle.position.y - circle.radius) * METER_TO_PIXEL_MULTIPLIER,
                circle.radius * 2 * METER_TO_PIXEL_MULTIPLIER,
                circle.radius * 2 * METER_TO_PIXEL_MULTIPLIER
        ));
//        gr.draw(new Line2D.Float(b.position.x, b.position.y, b.position.x + rx, b.position.y + ry));
    }

    private void drawPolygon(Polygon polygon, Graphics2D gr) {
//        Path2D.Float path = new Path2D.Float();
//        for (int i = 0; i < polygon.vertexCount; i++) {
//            Vector2 v = new Vector2(p.vertices[i]);
//            polygon.u.muli(v);
//            v.addi(b.position);
//
//            if (i == 0) {
//                path.moveTo(v.x, v.y);
//            } else {
//                path.lineTo(v.x, v.y);
//            }
//        }
//        path.closePath();
//
//        gr.setColor(Color.blue);
//        gr.draw(path);
    }

    // ------------------------------------------------------------------

    /**
     * Called once when the game starts, before any input, update, or draw occurs.
     */
    public abstract void start();

    /**
     * Add shapes to render into the scene
     * <p>
     * Called with the current state of the input and queues
     * of key and mouse events that have occurred since this method was last
     * called.
     *
     * @param input     The input state of the game.
     * @param deltaTime timeElapsed since last call of this function.
     */
    public abstract void update(GameInput input, float deltaTime);

    /**
     * Called once when the game ends, after all input, update, and draws end.
     * Release the resources here.
     */
    public abstract void destroy();

    /**
     * Determines whether the game is still being played. If the game is not
     * being played the game loop will stop and the game will be destroyed.
     *
     * @return True if the game is still being played, false if the game is ready
     * to be stopped and destroyed.
     */
    public abstract boolean isPlaying();

}
