var last, delta;
var keys = [];      //keys currently held down
function main() {
	const canvas = document.querySelector('#c');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	const renderer = new THREE.WebGLRenderer({canvas});



	const fov = 75;
	const aspect = canvas.width / canvas.height;  // the canvas default
	const near = 0.1;
	const far = 5;
	//const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	let cam = new FirstPersonCam();
	cam.position.x = 2;
	setup_input(cam);
	setup_resize_listener(cam, renderer);

	const scene = new THREE.Scene();

	setup_board(scene);
	last = new Date().getTime();
	loop = function() {
		let now = new Date().getTime();
		delta = (now - last)/1000;
		last = now;
		cam.update(delta,keys);
		renderer.render(scene, cam.camera);
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
		cam.camera.aspect = window.innerWidth / window.innerHeight;
		cam.camera.updateProjectionMatrix();
	});
}
