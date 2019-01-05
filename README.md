# LucidEngine
A basic physics2D engine for learning purposes.


### Project Structure
The project is divided into two sections:
1. Physics Part
    * Contains all the code for a stable physics simulation.
    * Like all physics engines, assumes all bodies are rigid bodies.
    * Right now all objects are instantiated as per required, not reusing the memory. But since
    it is just a demo I probably wont be fixing that.

2. Rendering Part
    * Handles the code for rendering collider shapes onto a window.
    * Contains a static camera and provides a scene interface like libGDX to interact with the physics world.
    * Has own inbuilt code for handling inputs and game loop provided by [him](https://github.com/ClickerMonkey).

Both part can be used independently, but for demo purposes some code do overlap.


### Physics Explanation
Mainly simulation consists of three steps

1. Calculate colliding pairs of rigidbodies i.e NarrowPhase calculation
    
    * Usually game engines first use a process called BroadPhase calculation (by dividing world into regions) to narrow down the
     rigidbodies that may collide. But since our game world is not big, I am skipping that part for now.
    * Then we proceed to narrow phase calculation (actually determining which bodies are colliding). I have implemented using
    [Separating Axis Theorem](https://gamedevelopment.tutsplus.com/tutorials/collision-detection-using-the-separating-axis-theorem--gamedev-169).

2. Use Semi-implicit (Symplectic) euler to apply forces and change position
```
 v += (1/m * F) * dt
 x += v * dt
```

3. Then Impulse Resolution using momentum conservation
 * Takes translational force and rotational torque
 * Takes static and dynamic friction