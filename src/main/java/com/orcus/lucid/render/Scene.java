package com.orcus.lucid.render;

import com.orcus.lucid.physics.RigidBody;
import com.orcus.lucid.physics.World;
import com.orcus.lucid.render.input.GameInput;
import com.orcus.lucid.render.loop.GameLoop;
import com.orcus.lucid.render.loop.GameLoopFixed;
import com.orcus.lucid.util.Vector2;

import java.awt.*;


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
        this.gameLoop = new GameLoopFixed(3, world.timeStep, 1/20);
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


    public void updateInternal(GameInput input, float deltaTime) {
        camera.update();
        update(input, deltaTime);
        physicsWorld.update(deltaTime);

        input.clear();
    }

    public void renderInternal(GameState state, Graphics2D gr) {
        camera.draw(state, gr);

        for (RigidBody b : physicsWorld.getRigidBodies()) {
            b.collider.render(b, gr, METER_TO_PIXEL_MULTIPLIER);
        }
        physicsWorld.renderContactPoints(gr, METER_TO_PIXEL_MULTIPLIER);

        // display graphics to screen
        gameScreen.update();
    }

    // some util functions

    public boolean isBodyOutOfScreen(RigidBody body) {
        return !(body.position.x < width/METER_TO_PIXEL_MULTIPLIER && body.position.x > 0 &&
                body.position.y < height/METER_TO_PIXEL_MULTIPLIER && body.position.y > 0);
    }

    public Vector2 renderToWorldCoordinate(Vector2 v) {
        return v.divi(METER_TO_PIXEL_MULTIPLIER);
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
