package com.orcus.lucid.render;

public class GameState {

    public float secondsDelta;
    public float forward = 0;
    public float backward = 0;
    public float interpolate = 0;

    private long lastTime;
    private long currentTime;

    public void reset() {
        long resetTime = System.nanoTime();
        lastTime = resetTime;
        currentTime = resetTime;
    }

    public long tick() {
        lastTime = currentTime;
        currentTime = System.nanoTime();
        return (currentTime - lastTime);
    }

    public long getElapsedSinceTick() {
        return (System.nanoTime() - currentTime);
    }

    public void setElapsed(long nanosElapsed) {
        secondsDelta = (float) (nanosElapsed * 0.000000001);
    }

}
