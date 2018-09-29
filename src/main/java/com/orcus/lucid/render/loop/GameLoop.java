package com.orcus.lucid.render.loop;

import com.orcus.lucid.render.GameState;
import com.orcus.lucid.render.Scene;
import com.orcus.lucid.render.input.GameInput;

import java.awt.*;

public interface GameLoop {
    void onStart(Scene scene, GameState state);

    boolean onLoop(Scene scene, GameState state, GameInput input, Graphics2D gr);
}
