// constants
const FPS = 30;

class SceneObject extends THREE.Mesh {
	constructor(geometry, material, body) {
		super(geometry, material);
		this.body = body;
	}
}

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
var objects = [];

initializeScene();
setInterval(update, (1/FPS) * 1000);

// update
function update() {
	// update physics
	world.step();

	// re-render the scene
	for (var i = 0; i < objects.length; i++) {
		var object = objects[i];

		object.position.copy(object.body.getPosition());
		object.quaternion.copy(object.body.getQuaternion());
	}
	renderer.render(scene, camera);
}


function initializeScene() {
	setupRenderingStuff();

	const sphereGeometry = new THREE.SphereGeometry(1, 12, 8);
	const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

	const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff });
	const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff });

	addGround();

	for (let i=0; i < 3; i++) {
		// add a sphere
		var body = world.addRigidbody({
			type: LUCID.BODY_DYNAMIC,
			shape: LUCID.SHAPE_SPHERE,
			position: [0.5 * (i), 10 * (1 + i), 0], // start position
			scale: [1, 1, 1], // size of shape
		});
		var mesh = new SceneObject(sphereGeometry, sphereMaterial, body);

		objects.push(mesh);
		scene.add(mesh);
	}

}


function setupRenderingStuff() {
	renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

	const dLight = new THREE.DirectionalLight(0xFFFFFF, 0.4);
	dLight.position.set(0, 10, 0);
	scene.add(dLight);

	let ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
	scene.add(ambientLight);

	const axesHelper = new THREE.AxesHelper(30);
	scene.add(axesHelper);

	const dist = 20;
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
	var geometry = new THREE.PlaneGeometry(size, size);
	var material = new THREE.MeshStandardMaterial({ color: 0xffffff , side: THREE.DoubleSide });

	var body = world.addRigidbody({
		type: LUCID.BODY_STATIC,
		shape: LUCID.SHAPE_PLANE,
		scale: [size, size, 1],
		position: [0, 0, 0],
		rotation: [Math.PI/2, 0, 0],
	});
	var mesh = new SceneObject(geometry, material, body);

	objects.push(mesh);
	scene.add(mesh);
}
