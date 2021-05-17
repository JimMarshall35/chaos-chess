
var last, delta;
var keys = [];      //keys currently held down
var scene;
function main() {
	const canvas = document.querySelector('#c');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	const renderer = new THREE.WebGLRenderer({canvas});



	const fov = 75;
	const aspect = canvas.width / canvas.height;  // the canvas default
	const near = 0.1;
	const far = 50;
	const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	//camera.lookAt(square_dims*4,square_dims*4,0);
	//let cam = new FirstPersonCam(); // will be replaced with better camera
	camera.position.x = square_dims * 4;
	camera.position.y = -square_dims * 4;
	camera.position.z = 6;
	camera.lookAt(square_dims*4,square_dims*4,0);
	setup_input(camera);
	setup_resize_listener(camera, renderer);

	scene = new THREE.Scene();

	setup_board(scene);
	setupLights(scene);
	pieces_loader.load();
	last = new Date().getTime();
	let loop = function() {
		let now = new Date().getTime();
		delta = (now - last)/1000;
		last = now;
		//cam.update(delta,keys);
		renderer.render(scene, camera);
		window.requestAnimationFrame(loop);
	}
	window.requestAnimationFrame(loop);
	
}
document.body.onload = main;

var isMouseDown = false;
function setup_input(cam) {
	window.addEventListener("mousedown",(e)=>{
		isMouseDown = true;
	});
	window.addEventListener("mouseup", (e)=>{
		isMouseDown = false;
	})
	window.addEventListener("mousemove",(e)=>{
		if(isMouseDown){
			cam.processMouse(e.movementX, e.movementY);
		}
	});
	window.addEventListener("keydown", (e) =>{
		if(!keys.includes(e.key)){
			keys.push(e.key);
		}
	});
	window.addEventListener("keyup", (e)=>{
		const index = keys.indexOf(e.key);
		if (index > -1) {
		  keys.splice(index, 1);
		}
	});
}

function setup_resize_listener(cam, renderer) {
	window.addEventListener("resize",()=>{
		renderer.setSize(window.innerWidth,window.innerHeight);
		cam.aspect = window.innerWidth / window.innerHeight;
		cam.updateProjectionMatrix();
	});
}

function setupLights(scene) {
	const light = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add( light );
	const plight = new THREE.PointLight( 0x404040, 2, 100 );
	plight.position.set( square_dims*4, square_dims*4, square_dims*4 );
	scene.add( plight );

}