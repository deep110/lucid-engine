package com.orcus.lucid.render;

public class GameState {

    public float seconds;
    public long millis;
    public long startTime;
    public long lastTime;
    public long currentTime;
    public float forward = 0;
    public float backward = 0;
    public float interpolate = 0;

    public long reset() {
        long resetTime = System.nanoTime();

        startTime = resetTime;
        lastTime = resetTime;
        currentTime = resetTime;

        return resetTime;
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
        millis = nanosElapsed / 1000000L;
        seconds = (float) (nanosElapsed * 0.000000001);
    }

}
