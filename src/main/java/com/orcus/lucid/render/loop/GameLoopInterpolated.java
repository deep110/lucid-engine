package com.orcus.lucid.render.loop;

import com.orcus.lucid.render.GameState;
import com.orcus.lucid.render.Scene;
import com.orcus.lucid.render.input.GameInput;

import java.awt.*;
import java.util.concurrent.TimeUnit;


public class GameLoopInterpolated implements GameLoop {

    public long frameRate; // the number of nanoseconds between update calls
    public int maxUpdates; // the maximum number of updates to call in a single loop invocation
    private long time; // the amount of time since the last update call, in nanoseconds

    public GameLoopInterpolated(int maxUpdates, double frameRate) {
        this.maxUpdates = maxUpdates;
        this.frameRate = (long) (frameRate * 1000000000L);
    }

    public GameLoopInterpolated(int maxUpdates, long frameRate, TimeUnit timeUnit) {
        this.maxUpdates = maxUpdates;
        this.frameRate = timeUnit.toNanos(frameRate);
    }

    @Override
    public void onStart(Scene scene, GameState state) {
        state.reset();
        state.setElapsed(frameRate);
    }

    @Override
    public boolean onLoop(Scene scene, GameState state, GameInput input, Graphics2D gr) {
        time += state.tick(); // nano-seconds elapsed

        int updateCount = 0;

        while (time >= frameRate && updateCount < maxUpdates) {
            scene.update(input, state.seconds);
            input.clear();

            if (!scene.isPlaying()) {
                return false;
            }

            updateCount++;
            time -= frameRate;
        }

        state.interpolate = getStateInterpolation();
        state.forward = state.interpolate * state.seconds;
        state.backward = state.forward - state.seconds;

        scene.drawInternal(state, gr);

        long actualTime = time + state.getElapsedSinceTick();
        long remainingTime = frameRate - actualTime;

        if (remainingTime > 0) {
            Thread.yield();
        }

        return true;
    }

    public float getStateInterpolation() {
        return (float) ((double) time / (double) frameRate);
    }

}