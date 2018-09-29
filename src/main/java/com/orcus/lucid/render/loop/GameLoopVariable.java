package com.orcus.lucid.render.loop;

import com.orcus.lucid.render.GameState;
import com.orcus.lucid.render.Scene;
import com.orcus.lucid.render.input.GameInput;

import java.awt.*;
import java.util.concurrent.TimeUnit;

/**
 * Simple game loop strategy where, looping is called
 */
public class GameLoopVariable implements GameLoop {

    private long maximumElapsed;

    public GameLoopVariable(double maximumElapsedSeconds) {
        this.maximumElapsed = (long) (maximumElapsedSeconds * 1000000000L);
    }

    public GameLoopVariable(long maximumElapsed, TimeUnit timeUnit) {
        this.maximumElapsed = timeUnit.toNanos(maximumElapsed);
    }

    @Override
    public void onStart(Scene scene, GameState state) {
        state.reset();
    }

    @Override
    public boolean onLoop(Scene scene, GameState state, GameInput input, Graphics2D gr) {
        state.setElapsed(Math.min(maximumElapsed, state.tick()));

        scene.updateInternal(input, state.seconds);
        input.clear();

        if (!scene.isPlaying()) {
            return false; // Game stopped in update call, don’t draw to the screen, exit.
        }

        scene.drawInternal(state, gr);

        return true;
    }

}
