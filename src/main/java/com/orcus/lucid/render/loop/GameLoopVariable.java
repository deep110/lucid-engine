package com.orcus.lucid.render.loop;

import com.orcus.lucid.render.GameState;
import com.orcus.lucid.render.Scene;
import com.orcus.lucid.render.input.GameInput;

import java.awt.*;

/**
 * Simple game loop strategy where, looping is called
 */
public class GameLoopVariable implements GameLoop {

    // max value to pass to deltaTime so that physics does not break
    private long maximumElapsed;

    public GameLoopVariable(double maximumElapsedSeconds) {
        this.maximumElapsed = (long) (maximumElapsedSeconds * 1000000000L);
    }

    @Override
    public void onStart(Scene scene, GameState state) {
        state.reset();
    }

    @Override
    public boolean onLoop(Scene scene, GameState state, GameInput input, Graphics2D gr) {
        state.setElapsed(Math.min(maximumElapsed, state.tick()));

        scene.updateInternal(input, state.secondsDelta);

        if (!scene.isPlaying()) {
            return false; // Game stopped in update call, don’t draw to the screen, exit.
        }

        scene.renderInternal(state, gr);

        return true;
    }

}
