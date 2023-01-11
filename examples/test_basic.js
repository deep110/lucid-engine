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
let objects = [];
let geometries = {};
let materials = {};

initializeScene();
setInterval(update, (1/FPS) * 1000);


function initializeScene() {
	renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
	scene.background = new THREE.Color("#3a3a3a");

	const dLight = new THREE.DirectionalLight(0xFFFFFF, 0.4);
	dLight.position.set(0, 10, 0);
	scene.add(dLight);

	let ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
	scene.add(ambientLight);

	const axesHelper = new THREE.AxesHelper(80);
	scene.add(axesHelper);

	const dist = 50;
	camera.position.set(dist, dist, dist);

	// setup orbit
	controls = new THREE.OrbitControls(camera, canvas);
	controls.listenToKeyEvents(window);
	controls.addEventListener('change', () => {
		renderer.render(scene, camera);
	});

	geometries["sphere"] = new THREE.SphereGeometry(1, 12, 8);
	geometries["box"] = new THREE.BoxGeometry(1, 1, 1);
	geometries["cylinder"] = new THREE.CylinderGeometry(2, 2, 5, 32);

	materials["sphere"] = new THREE.MeshStandardMaterial({ color: 0xff00ff });
	materials["box"] = new THREE.MeshStandardMaterial({ color: 0xff00ff });
	materials["cylinder"] = new THREE.MeshStandardMaterial({ color: 0xff0000 });

	// by default add spheres
	populate(0);
}


function populate(type) {
	clearScene();
	addGround();

	var x, y, z, w, h, d;

	for (let i = 0; i < 100; i++) {
		x = -25 + Math.random()*50;
		z = -25 + Math.random()*50;
		y = 3 + Math.random()*20;
		w = 10 + Math.random()*10;
		h = 10 + Math.random()*10;
		d = 10 + Math.random()*10;

		var mesh;

		if(type === 0){
			var body = world.addRigidbody({ type: LUCID.BODY_DYNAMIC, shape: LUCID.SHAPE_SPHERE, position: [x, y, z] });
			mesh = new SceneObject(geometries.sphere, materials.sphere, body);
		} else {
			console.error("shape not handled: ", type);
			break;
		}

		objects.push(mesh);
		scene.add(mesh);
	}
}


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


function clearScene() {
	var i = objects.length;
    while (i--) scene.remove(objects[i]);

	world.clear();
	objects = [];
}


function addGround() {
	var size = 60;
	var geometry = new THREE.PlaneGeometry(size, size);
	var material = new THREE.MeshStandardMaterial({ color: 0xffffff , side: THREE.DoubleSide });

	var body = world.addRigidbody({
		type: LUCID.BODY_STATIC,
		shape: LUCID.SHAPE_PLANE,
		scale: [size, size, 1],
		position: [0, 0, 0],
		rotation: [-Math.PI/2, 0, 0],
		rotationOrder: "XYZ", // use the three.js default order
	});
	var mesh = new SceneObject(geometry, material, body);

	objects.push(mesh);
	scene.add(mesh);
}
