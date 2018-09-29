package com.orcus.lucid.render;

import com.orcus.lucid.render.input.GameInput;

import javax.swing.*;
import java.awt.*;
import java.awt.image.BufferedImage;


/**
 * @author Philip Diffenderfer, Deepankar Agrawal
 */
public class GameScreen extends JPanel {

    private static final long serialVersionUID = 1L;

    // The double buffer used to eliminate flickering.
    private BufferedImage buffer;

    // The flag to have anti-aliasing for drawing (smoother drawing).
    private boolean antiAliasing;

    // The graphics object used for drawing.
    private Graphics2D graphics;

    // The input of the game.
    private GameInput input;


    /**
     * Instantiates a new screen to play a game.
     *
     * @param width        The width of the screen in pixels.
     * @param height       The height of the screen in pixels.
     * @param antiAliasing True if drawing should be smooth, otherwise false.
     */
    public GameScreen(int width, int height, boolean antiAliasing) {
        Dimension d = new Dimension(width, height);
        this.setSize(d);
        this.setPreferredSize(d);
        this.setFocusable(true);

        this.antiAliasing = antiAliasing;
        this.buffer = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
        this.input = new GameInput();
    }

    /**
     * Starts the game loop until the game is no longer being played.
     *
     * @return graphics used to render on screen
     */
    public Graphics2D start(String title) {
        showWindow(title);
        setBackground(Color.black);
        input.mouseInside = getParent().contains(MouseInfo.getPointerInfo().getLocation());

        addKeyListener(input);
        addMouseListener(input);
        addMouseMotionListener(input);

        resetGraphics();

        return graphics;
    }

    public void update() {
        renderGraphics(getGraphics());
        resetGraphics();
    }

    public GameInput getInput() {
        return input;
    }

    @Override
    public final void paint(Graphics g) {
        if (g == null || buffer == null) {
            return;
        }

        // Attempt to draw this frame. Occasionally there are random errors.
        try {
            resetGraphics();
            renderGraphics(g);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void renderGraphics(Graphics gr) {
        gr.drawImage(buffer, 0, 0, this);
        gr.dispose();
    }

    /**
     * Resets the graphics which get drawn on to prepare for another frame.
     */
    private void resetGraphics() {
        // Get the graphics of the buffer
        graphics = (Graphics2D) buffer.getGraphics();

        // Clear the buffer with the background color
        graphics.setColor(getBackground());
        graphics.fillRect(0, 0, getWidth(), getHeight());

        // If anti-aliasing is turned on enable it.
        if (antiAliasing) {
            graphics.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        }
    }

    /**
     * Overrides the update method to enable double buffering.
     */
    @Override
    public final void update(Graphics g) {
        paint(g);
    }

    /**
     * Shows the given GameScreen in a window with the given title.
     *
     * @param title      The title of the window.
     */
    private void showWindow(String title) {
        JFrame window = new JFrame(title);
        window.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
        window.add(this);
        window.pack();
        window.setVisible(true);
    }

}
