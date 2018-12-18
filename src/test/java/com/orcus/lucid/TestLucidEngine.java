package com.orcus.lucid;


import com.orcus.lucid.physics.Mathf;
import com.orcus.lucid.physics.World;
import com.orcus.lucid.util.Vector2;

public class TestLucidEngine {

    public static void main(String[] args) {
        Vector2 gravity = new Vector2(0, -10);

        World world = new World(gravity, Mathf.DT);

        TestScene testScene = new TestScene(720, 640, world);
        testScene.showWindow("Lucid Engine");
    }
}