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
let isSimulating = true;

// initialize physics world
let world = new LUCID.World({
	timestep: 1 / FPS,
	iterations: 8,
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

	const axesHelper = new THREE.AxesHelper(100);
	scene.add(axesHelper);

	const dist = 50;
	camera.position.set(dist, dist, dist);

	// setup orbit
	controls = new THREE.OrbitControls(camera, canvas);
	controls.listenToKeyEvents(window);
	controls.addEventListener('change', () => {
		renderer.render(scene, camera);
	});

	geometries["sphere"] = new THREE.SphereGeometry(1, 16, 12);
	geometries["box"] = new THREE.BoxGeometry(1, 1, 1);
	geometries["cylinder"] = new THREE.CylinderGeometry(2, 2, 5, 32);

	materials["sphere"] = new THREE.MeshStandardMaterial({ color: 0xff0000, wireframe: false });
	materials["box"] = new THREE.MeshStandardMaterial({ color: basicTexture(3), wireframe: false });
	materials["cylinder"] = new THREE.MeshStandardMaterial({ color: 0xff0000 });

	stats.showPanel(1);
	document.getElementById("info").appendChild(stats.dom);
	stats.dom.style = "cursor: pointer; opacity: 0.9; z-index: 10000;";

	window.addEventListener('resize', onWindowResize, false);

	// setup scene
	clearScene();
	addGround();
	populate(0); // by default add spheres

	canvas.addEventListener('click', function() {
		populate(0);
		// var b = objects[1].body;
		// let pos = b.getPosition();

		// let forcePos = pos.add(new LUCID.Vec3(0, 5, 0));
		// b.applyForce(new LUCID.Vec3(100, 0, 100), forcePos);
		// console.log("click called: ", b.getPosition(), forcePos, b.angularVelocity);
	}, false);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}


function populate(type) {
	var x, y, z, w, h, d;

	for (let i = 0; i < 10; i++) {
		x = -5 + Math.random()*10;
		y = 20 + Math.random()*20;
		z = -5 + Math.random()*30;
		w = 5 + Math.random()*10;
		h = 5 + Math.random()*10;
		d = 5 + Math.random()*10;

		var mesh;

		if(type === 0) {
			w = 8;
			var body = world.addRigidbody({ type: LUCID.BODY_DYNAMIC, shape: LUCID.SHAPE_SPHERE, position: [x, y, z], scale: [w, w, w] });
			mesh = new SceneObject(geometries.sphere, materials.sphere, body);
		} else if(type === 1) {
			w = 8;
			var body = world.addRigidbody({ type: LUCID.BODY_DYNAMIC, shape: LUCID.SHAPE_BOX, position: [x, y, z], scale: [w, w, w] });
			mesh = new SceneObject(geometries.box, materials.box, body);
		} else {
			console.error("shape not handled: ", type);
			break;
		}

		objects.push(mesh);
		scene.add(mesh);
	}
}

function toggle() {
	isSimulating = !isSimulating;
}


// update
function update() {
	stats.begin();

	// update physics
	if (isSimulating) {
		world.step();
		removeOOSBodies();
	}

	stats.end();

	// re-render the scene
	for (var i = 0; i < objects.length; i++) {
		var object = objects[i];

		object.position.copy(object.body.getPosition());
		object.quaternion.copy(object.body.getRotation());

		let scale = object.body.getScale();
		if (object.body.shape != LUCID.SHAPE_SPHERE) {
			if (!scale.equals(object.scale.x, object.scale.y, object.scale.z)) {
				object.scale.copy(scale);
			}
		} else {
			// threejs uses radius as scale for spheres instead of diameter
			if (!scale.equals(2 * object.scale.x, 2 * object.scale.y, 2 * object.scale.z)) {
				object.scale.x = scale.x * 0.5;
				object.scale.y = scale.y * 0.5;
				object.scale.z = scale.z * 0.5;
			}
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
	var size = 100;
	var body = world.addRigidbody({
		type: LUCID.BODY_STATIC,
		shape: LUCID.SHAPE_BOX,
		scale: [size, 2, size],
		position: [0, 0, 0],
		// rotation: [-Math.PI/4, 0, 0],
		// rotationOrder: "XYZ", // use the three.js default order
	});
	var mesh = new SceneObject(geometries["box"], materials["box"], body);

	objects.push(mesh);
	scene.add(mesh);

	// const p = 30;
	// const geometry = new THREE.PlaneGeometry(p, p, p, p);
	// const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide, wireframe: true} );
	// const plane = new THREE.Mesh( geometry, material );
	// plane.rotation.x = -Math.PI/2;
	// scene.add( plane );
}

function removeOOSBodies() {
	for (var i = objects.length - 1; i > -1; i--) {
		var object = objects[i];

		var position = object.body.getPosition();
		if (object.body.canMove() && position.y < -150) {
			world.removeRigidbody(object.body);
			objects.splice(i, 1);
			scene.remove(object);
		}
	}
}


function basicTexture(n){
	var canvas = document.createElement( 'canvas' );
	canvas.width = canvas.height = 64;
	var ctx = canvas.getContext( '2d' );
	var color;
	if(n===0) color = "#3884AA";// sphere58AA80
	if(n===1) color = "#61686B";// sphere sleep
	if(n===2) color = "#AA6538";// box
	if(n===3) color = "#61686B";// box sleep
	if(n===4) color = "#AAAA38";// cyl
	if(n===5) color = "#61686B";// cyl sleep
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, 64, 64);
	ctx.fillStyle = "rgba(0,0,0,0.2)";
	ctx.fillRect(0, 0, 32, 32);
	ctx.fillRect(32, 32, 32, 32);

	var tx = new THREE.Texture(canvas);
	tx.needsUpdate = true;
	return tx;
}
