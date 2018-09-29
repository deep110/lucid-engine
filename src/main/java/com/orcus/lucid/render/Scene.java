package com.orcus.lucid.render;

import com.orcus.lucid.render.input.GameInput;
import com.orcus.lucid.render.loop.GameLoop;
import com.orcus.lucid.render.loop.GameLoopVariable;
import com.orcus.lucid.util.Vector2;

import java.awt.*;


public abstract class Scene {

    public final Camera camera;
    private int width, height;

    private GameScreen gameScreen;
    private GameLoop gameLoop;


    public Scene(int width, int height) {
        this.width = width;
        this.height = height;
        this.camera = new Camera(width, height);
        this.gameLoop = new GameLoopVariable(0.1f);
        this.gameScreen = new GameScreen(width, height, true);
    }

    public void showWindow(String title) {
        Graphics2D graphics = gameScreen.start(title);
        GameInput gameInput = gameScreen.getInput();

        GameState gameState = new GameState();
        gameLoop.onStart(this, gameState);

        // call start
        start();

        while (isPlaying()) {
            if (gameLoop.onLoop(this, gameState, gameInput, graphics)) {
                // display graphics to screen
                gameScreen.update();
            }
        }

        // call destroy
        destroy();

        System.exit(0);
    }

    public void updateInternal(GameInput input, float deltaTime) {
        camera.update();
        update(input, deltaTime);
    }

    public void drawInternal(GameState state, Graphics2D gr) {
        camera.draw(state, gr);

//        for (Body b : impulse.bodies) {
//            if (b.shape instanceof Circle) {
//                Circle c = (Circle) b.shape;
//
//                float rx = (float) StrictMath.cos(b.orient) * c.radius;
//                float ry = (float) StrictMath.sin(b.orient) * c.radius;
//
//                gr.setColor(Color.red);
//                gr.draw(new Ellipse2D.Float(b.position.x - c.radius, b.position.y - c.radius, c.radius * 2, c.radius * 2));
//                gr.draw(new Line2D.Float(b.position.x, b.position.y, b.position.x + rx, b.position.y + ry));
//            } else if (b.shape instanceof Polygon) {
//                Polygon p = (Polygon) b.shape;
//
//                Path2D.Float path = new Path2D.Float();
//                for (int i = 0; i < p.vertexCount; i++) {
//                    Vector2 v = new Vector2(p.vertices[i]);
//                    b.shape.u.muli(v);
//                    v.addi(b.position);
//
//                    if (i == 0) {
//                        path.moveTo(v.x, v.y);
//                    } else {
//                        path.lineTo(v.x, v.y);
//                    }
//                }
//                path.closePath();
//
//                gr.setColor(Color.blue);
//                gr.draw(path);
//            }
//        }
//
//        gr.setColor(Color.white);
//        for (Manifold m : impulse.contacts) {
//            for (int i = 0; i < m.contactCount; i++) {
//                Vector2 v = m.contacts[i];
//                Vector2 n = m.normal;
//
//                gr.draw(new Line2D.Float(v.x, v.y, v.x + n.x * 4.0f, v.y + n.y * 4.0f));
//            }
//        }
    }

    public Vector2 getWorldCoordinate(Vector2 mouse, Vector2 out) {
        return getWorldCoordinate(mouse.x, mouse.y, out);
    }

    public Vector2 getWorldCoordinate(float mouseX, float mouseY, Vector2 out) {
        out.x = getWorldCoordinateX(mouseX);
        out.y = getWorldCoordinateY(mouseY);

        return out;
    }

    public float getWorldCoordinateX(float mouseX) {
        return camera.bounds.left + camera.bounds.getWidth() * mouseX / width;
    }

    public float getWorldCoordinateY(float mouseY) {
        return camera.bounds.top + camera.bounds.getHeight() * mouseY / height;
    }

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
