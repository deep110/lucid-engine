// constants
const FPS = 20;

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
setInterval(update, (1/FPS) * 1000);

// update
function update() {
	// update scene
	updatePhysics();

	// re-render the scene
	renderer.render(scene, camera);
}


function initializeScene() {
	setupRenderingStuff();

	const sphereGeometry = new THREE.SphereGeometry(1, 12, 8);
	const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

	const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
	const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff });

	addGround();

	// add a box
	var body = world.addRigidbody({
		type: LUCID.SHAPE_BOX,
		scale: [1, 1, 1], // size of shape
		position: [0, 20, 0], // start position in degree
		move: true, // dynamic or static
		friction: 0.6,
	});
	bodies.push(body);

	var mesh = new THREE.Mesh(boxGeometry, boxMaterial);
	meshes.push(mesh);

	scene.add(mesh);
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

	const axesHelper = new THREE.AxesHelper(30);
	scene.add(axesHelper);

	const dist = 25;
	camera.position.set(dist, dist, dist);

	// setup orbit
	controls = new THREE.OrbitControls(camera, canvas);
	controls.listenToKeyEvents(window);
	controls.addEventListener('change', () => {
		renderer.render(scene, camera);
	});
}


function addGround() {
	var size = 20;
	var geometry = new THREE.BoxGeometry(size, 1, size);
	var material = new THREE.MeshStandardMaterial({ color: 0xffffff });

	var body = world.addRigidbody({
		type: LUCID.SHAPE_BOX,
		size: [size, 1, size],
		position: [0, 0, 0],
		move: false,
	});
	bodies.push(body);

	var mesh = new THREE.Mesh(geometry, material);
	meshes.push(mesh);

	scene.add(mesh);
}
