// constants
const FPS = 1;

// initialize canvas
let canvas = document.getElementById("canvas");
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ canvas: canvas });

// initialize physics world
let world = new LUCID.World({
	timestep: 1 / FPS,
	iterations: 8,
	worldscale: 1,
	info: false,
	gravity: [0, -9.8, 0],
});

// initialize scene
var meshes = [];
var bodies = [];

initializeScene();
update();

// update
function update() {
	// update scene
	updatePhysics();

	// re-render the scene
	renderer.render(scene, camera);
	requestAnimationFrame(update);
}


function initializeScene() {
	setupRenderingStuff();

	const sphereGeometry = new THREE.SphereGeometry(1, 12, 8);
	const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

	// add a sphere
	bodies[0] = world.addRigidbody({
		type: LUCID.SHAPE_SPHERE,
		size: [1, 1, 1], // size of shape
		position: [0, 0, 0], // start position in degree
		move: true, // dynamic or static
	});
	meshes[0] = new THREE.Mesh(sphereGeometry, sphereMaterial);
	scene.add(meshes[0]);
}


function updatePhysics() {
	world.step();

	for (var i = 0; i < meshes.length; i++) {
		var mesh = meshes[i];
		var body = bodies[i];

		mesh.position.copy(body.getPosition());
		// mesh.quaternion.copy(body.getQuaternion());
	}
}


function setupRenderingStuff() {
	renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

	const dLight = new THREE.DirectionalLight(0xFFFFFF, 0.5);
	dLight.position.set(-5, 2, 10);
	scene.add(dLight);

	let ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
	scene.add(ambientLight);

	const axesHelper = new THREE.AxesHelper(10);
	scene.add(axesHelper);

	camera.position.set(10, 10, 10);

	// setup orbit
	controls = new THREE.OrbitControls(camera, canvas);
	controls.listenToKeyEvents(window);
	controls.addEventListener('change', () => {
		renderer.render(scene, camera);
	});
}
