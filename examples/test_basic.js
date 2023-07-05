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
let stats = new Stats();

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

	geometries["sphere"] = new THREE.WireframeGeometry(new THREE.SphereGeometry(1, 16, 12));
	geometries["box"] = new THREE.BoxGeometry(1, 1, 1);
	geometries["cylinder"] = new THREE.CylinderGeometry(2, 2, 5, 32);
	geometries["plane"] = new THREE.PlaneGeometry(1, 1);;

	materials["sphere"] = new THREE.LineBasicMaterial({ color: 0x00ffff });
	materials["box"] = new THREE.MeshStandardMaterial({ color: 0xff00ff });
	materials["cylinder"] = new THREE.MeshStandardMaterial({ color: 0xff0000 });
	materials["plane"] = new THREE.MeshStandardMaterial({ color: 0xffffff , side: THREE.DoubleSide });


	stats.showPanel(1);
	document.getElementById("info").appendChild(stats.dom);
	stats.dom.style = "cursor: pointer; opacity: 0.9; z-index: 10000;";

	window.addEventListener('resize', onWindowResize, false);

	// by default add spheres
	populate(0);

	canvas.addEventListener('click', function() {
		var b = objects[1].body;
		let pos = b.getPosition();

		let forcePos = pos.add(new LUCID.Vec3(0, 5, 0));
		b.applyForce(new LUCID.Vec3(100, 0, 0), forcePos);
		console.log("click called: ", b.getPosition(), forcePos, b.invModelInertia);
	}, false);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}


function populate(type) {
	clearScene();
	addGround();

	var x, y, z, w, h, d;

	for (let i = 0; i < 1; i++) {
		x = -5 + Math.random()*10;
		z = -5 + Math.random()*10;
		y = 3 + Math.random()*20;
		w = 10 + Math.random()*10;
		h = 10 + Math.random()*10;
		d = 10 + Math.random()*10;

		var mesh;

		if(type === 0){
			var body = world.addRigidbody({ type: LUCID.BODY_DYNAMIC, shape: LUCID.SHAPE_SPHERE, position: [x, y, z], scale: [5, 5, 5] });
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
	stats.begin();

	// update physics
	world.step();

	stats.end();

	// re-render the scene
	for (var i = 0; i < objects.length; i++) {
		var object = objects[i];

		object.position.copy(object.body.getPosition());
		object.quaternion.copy(object.body.getQuaternion());

		let scale = object.body.getScale();
		if (!scale.equals(object.scale.x, object.scale.y, object.scale.z)) {
			object.scale.copy(scale);
		}
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
	var body = world.addRigidbody({
		type: LUCID.BODY_STATIC,
		shape: LUCID.SHAPE_PLANE,
		scale: [size, size, 1],
		position: [0, 0, 0],
		rotation: [-Math.PI/2, 0, 0],
		rotationOrder: "XYZ", // use the three.js default order
	});
	var mesh = new SceneObject(geometries["plane"], materials["plane"], body);

	objects.push(mesh);
	scene.add(mesh);
}
