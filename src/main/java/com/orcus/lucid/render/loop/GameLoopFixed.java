package com.orcus.lucid.render.loop;

import com.orcus.lucid.render.GameState;
import com.orcus.lucid.render.Scene;
import com.orcus.lucid.render.input.GameInput;

import java.awt.*;
import java.util.concurrent.TimeUnit;


public class GameLoopFixed implements GameLoop {

    public long updateRate;
    public long drawRate;
    public int maxUpdates;
    private long updateTime;
    private long drawTime;

    public GameLoopFixed(int maxUpdates, double updateRate, double drawRate) {
        this.maxUpdates = maxUpdates;
        this.updateRate = (long) (updateRate * 1000000000L);
        this.drawRate = (long) (drawRate * 1000000000L);
    }

    public GameLoopFixed(int maxUpdates, long updateRate, long drawRate, TimeUnit timeUnit) {
        this.maxUpdates = maxUpdates;
        this.updateRate = timeUnit.toNanos(updateRate);
        this.drawRate = timeUnit.toNanos(drawRate);
    }

    @Override
    public void onStart(Scene scene, GameState state) {
        state.reset();
        state.setElapsed(updateRate);
    }

    @Override
    public boolean onLoop(Scene scene, GameState state, GameInput input, Graphics2D gr) {
        long nanosElapsed = state.tick();

        updateTime += nanosElapsed;

        int updateCount = 0;

        while (updateTime >= updateRate && updateCount < maxUpdates) {
            scene.update(input, state.seconds);
            input.clear();

            if (!scene.isPlaying()) {
                return false;
            }

            updateCount++;
            updateTime -= updateRate;
        }

        drawTime += nanosElapsed;

        int drawCount = 0;

        if (drawTime >= drawRate || updateCount > 0) {
            state.interpolate = getStateInterpolation();
            state.forward = state.interpolate * state.seconds;
            state.backward = state.forward - state.seconds;

            scene.drawInternal(state, gr);
            drawCount++;

            drawTime -= (drawRate == 0 ? drawTime : drawRate);
        }

        if (drawCount == 0 && updateCount == 0) {
            long actualTime = updateTime + state.getElapsedSinceTick();
            long sleep = (updateRate - actualTime) / 1000000L;

            if (sleep > 1) {
                try {
                    Thread.sleep(sleep - 1);
                } catch (Exception e) {
                }
            }
        }

        return (drawCount > 0);
    }

    public float getStateInterpolation() {
        return (float) ((double) updateTime / (double) updateRate);
    }

}
