package com.orcus.lucid.render.input;

import com.orcus.lucid.render.GameState;
import com.orcus.lucid.render.Scene;

import javax.swing.event.MouseInputListener;
import java.awt.*;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

/**
 * Contains the current mouse and keyboard input state as well as queues of
 * mouse and keyboard events that have occurred since the last
 * {@link Scene#update(GameInput, float)} was invoked.
 *
 * @author Philip Diffenderfer
 */
public class GameInput implements KeyListener, MouseInputListener {

    public int keyDownCount, keyUpCount;
    public boolean[] keyDown = new boolean[256];
    public boolean[] keyUp = new boolean[256];
    public Queue<GameKeyEvent> keyEvents = new ConcurrentLinkedQueue<>();

    public int mouseX, mouseY, mouseDownCount, mouseUpCount;
    public boolean[] mouseDown = new boolean[MouseInfo.getNumberOfButtons()];
    public boolean[] mouseUp = new boolean[MouseInfo.getNumberOfButtons()];
    public boolean mouseInside = true;
    public boolean mouseDragging = false;
    public boolean mouseMoving = false;
    public Queue<GameMouseEvent> mouseEvents = new ConcurrentLinkedQueue<>();

    public void clear() {
        keyDownCount = 0;
        keyUpCount = 0;
        keyEvents.clear();

        for (int i = 0; i < keyUp.length; i++) {
            keyUp[i] = false;
        }

        mouseDownCount = 0;
        mouseUpCount = 0;
        mouseDragging = false;
        mouseMoving = false;
        mouseEvents.clear();

        for (int i = 0; i < mouseUp.length; i++) {
            mouseUp[i] = false;
        }
    }

    @Override
    public void keyTyped(KeyEvent e) {
        keyEvents.offer(new GameKeyEvent(GameKeyType.TYPE, e));
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (!keyDown[e.getKeyCode()]) {
            keyDown[e.getKeyCode()] = true;
            keyDownCount++;

            keyEvents.offer(new GameKeyEvent(GameKeyType.DOWN, e));
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
        keyDown[e.getKeyCode()] = false;
        keyUp[e.getKeyCode()] = true;
        keyUpCount++;

        keyEvents.offer(new GameKeyEvent(GameKeyType.UP, e));
    }

    @Override
    public void mouseDragged(MouseEvent e) {
        mouseDragging = true;
        mouseMoving = true;
    }

    @Override
    public void mouseMoved(MouseEvent e) {
        mouseDragging = false;
        mouseMoving = true;
        mouseX = e.getX();
        mouseY = e.getY();
    }

    @Override
    public void mouseClicked(MouseEvent e) {
        mouseEvents.offer(new GameMouseEvent(GameMouseType.CLICK, e));
    }

    @Override
    public void mousePressed(MouseEvent e) {
        mouseDown[e.getButton()] = true;
        mouseDownCount++;

        mouseEvents.offer(new GameMouseEvent(GameMouseType.PRESS, e));
    }

    @Override
    public void mouseReleased(MouseEvent e) {
        mouseDown[e.getButton()] = false;
        mouseUp[e.getButton()] = true;
        mouseUpCount++;

        mouseEvents.offer(new GameMouseEvent(GameMouseType.RELEASE, e));
    }

    @Override
    public void mouseEntered(MouseEvent e) {
        mouseInside = true;
        mouseEvents.offer(new GameMouseEvent(GameMouseType.ENTER, e));
    }

    @Override
    public void mouseExited(MouseEvent e) {
        mouseInside = false;
        mouseEvents.offer(new GameMouseEvent(GameMouseType.EXIT, e));
    }

}
