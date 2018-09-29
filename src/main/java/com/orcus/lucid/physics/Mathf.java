/*
    Copyright (c) 2013 Randy Gaul http://RandyGaul.net
    This software is provided 'as-is', without any express or implied
    warranty. In no event will the authors be held liable for any damages
    arising from the use of this software.
    Permission is granted to anyone to use this software for any purpose,
    including commercial applications, and to alter it and redistribute it
    freely, subject to the following restrictions:
      1. The origin of this software must not be misrepresented; you must not
         claim that you wrote the original software. If you use this software
         in a product, an acknowledgment in the product documentation would be
         appreciated but is not required.
      2. Altered source versions must be plainly marked as such, and must not be
         misrepresented as being the original software.
      3. This notice may not be removed or altered from any source distribution.

    Port to Java by Philip Diffenderfer http://magnos.org
*/

package com.orcus.lucid.physics;

import com.orcus.lucid.physics.struct.Vector2;

public class Mathf {

    public static final float PI = (float) StrictMath.PI;
    public static final float EPSILON = 0.0001f;
    public static final float EPSILON_SQ = EPSILON * EPSILON;
    public static final float BIAS_RELATIVE = 0.95f;
    public static final float BIAS_ABSOLUTE = 0.01f;
    public static final float DT = 1.0f / 60.0f;
    public static final Vector2 GRAVITY = new Vector2(0.0f, 50.0f);
    public static final float RESTING = GRAVITY.mul(DT).lengthSq() + EPSILON;
    public static final float PENETRATION_ALLOWANCE = 0.05f;
    public static final float PENETRATION_CORRETION = 0.4f;

    public static boolean equal(float a, float b) {
        return StrictMath.abs(a - b) <= EPSILON;
    }

    public static float clamp(float min, float max, float a) {
        return (a < min ? min : (a > max ? max : a));
    }

    public static int round(float a) {
        return (int) (a + 0.5f);
    }

    public static float random(float min, float max) {
        return (float) ((max - min) * Math.random() + min);
    }

    public static int random(int min, int max) {
        return (int) ((max - min + 1) * Math.random() + min);
    }

    public static boolean gt(float a, float b) {
        return a >= b * BIAS_RELATIVE + a * BIAS_ABSOLUTE;
    }
}
