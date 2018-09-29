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

package com.orcus.lucid.util;

public class Mat2 {

    public float m00, m01;
    public float m10, m11;

    public Mat2() {
    }

    public Mat2(float radians) {
        set(radians);
    }

    public Mat2(float a, float b, float c, float d) {
        set(a, b, c, d);
    }

    /**
     * Sets this matrix to a rotation matrix with the given radians.
     */
    public void set(float radians) {
        float c = (float) StrictMath.cos(radians);
        float s = (float) StrictMath.sin(radians);

        m00 = c;
        m01 = -s;
        m10 = s;
        m11 = c;
    }

    /**
     * Sets the values of this matrix.
     */
    public void set(float a, float b, float c, float d) {
        m00 = a;
        m01 = b;
        m10 = c;
        m11 = d;
    }

    /**
     * Sets this matrix to have the same values as the given matrix.
     */
    public void set(Mat2 m) {
        m00 = m.m00;
        m01 = m.m01;
        m10 = m.m10;
        m11 = m.m11;
    }

    /**
     * Sets the values of this matrix to their absolute value.
     */
    public void absi() {
        abs(this);
    }

    /**
     * Returns a new matrix that is the absolute value of this matrix.
     */
    public Mat2 abs() {
        return abs(new Mat2());
    }

    /**
     * Sets out to the absolute value of this matrix.
     */
    public Mat2 abs(Mat2 out) {
        out.m00 = StrictMath.abs(m00);
        out.m01 = StrictMath.abs(m01);
        out.m10 = StrictMath.abs(m10);
        out.m11 = StrictMath.abs(m11);
        return out;
    }

    /**
     * Sets out to the x-axis (1st column) of this matrix.
     */
    public Vector2 getAxisX(Vector2 out) {
        out.x = m00;
        out.y = m10;
        return out;
    }

    /**
     * Returns a new vector that is the x-axis (1st column) of this matrix.
     */
    public Vector2 getAxisX() {
        return getAxisX(new Vector2());
    }

    /**
     * Sets out to the y-axis (2nd column) of this matrix.
     */
    public Vector2 getAxisY(Vector2 out) {
        out.x = m01;
        out.y = m11;
        return out;
    }

    /**
     * Returns a new vector that is the y-axis (2nd column) of this matrix.
     */
    public Vector2 getAxisY() {
        return getAxisY(new Vector2());
    }

    /**
     * Sets the matrix to it's transpose.
     */
    public void transposei() {
        float t = m01;
        m01 = m10;
        m10 = t;
    }

    /**
     * Sets out to the transpose of this matrix.
     */
    public Mat2 transpose(Mat2 out) {
        out.m00 = m00;
        out.m01 = m10;
        out.m10 = m01;
        out.m11 = m11;
        return out;
    }

    /**
     * Returns a new matrix that is the transpose of this matrix.
     */
    public Mat2 transpose() {
        return transpose(new Mat2());
    }

    /**
     * Transforms v by this matrix.
     */
    public Vector2 muli(Vector2 v) {
        return mul(v.x, v.y, v);
    }

    /**
     * Sets out to the transformation of v by this matrix.
     */
    public Vector2 mul(Vector2 v, Vector2 out) {
        return mul(v.x, v.y, out);
    }

    /**
     * Returns a new vector that is the transformation of v by this matrix.
     */
    public Vector2 mul(Vector2 v) {
        return mul(v.x, v.y, new Vector2());
    }

    /**
     * Sets out the to transformation of {x,y} by this matrix.
     */
    public Vector2 mul(float x, float y, Vector2 out) {
        out.x = m00 * x + m01 * y;
        out.y = m10 * x + m11 * y;
        return out;
    }

    /**
     * Multiplies this matrix by x.
     */
    public void muli(Mat2 x) {
        set(
                m00 * x.m00 + m01 * x.m10,
                m00 * x.m01 + m01 * x.m11,
                m10 * x.m00 + m11 * x.m10,
                m10 * x.m01 + m11 * x.m11);
    }

    /**
     * Sets out to the multiplication of this matrix and x.
     */
    public Mat2 mul(Mat2 x, Mat2 out) {
        out.m00 = m00 * x.m00 + m01 * x.m10;
        out.m01 = m00 * x.m01 + m01 * x.m11;
        out.m10 = m10 * x.m00 + m11 * x.m10;
        out.m11 = m10 * x.m01 + m11 * x.m11;
        return out;
    }

    /**
     * Returns a new matrix that is the multiplication of this and x.
     */
    public Mat2 mul(Mat2 x) {
        return mul(x, new Mat2());
    }
}
