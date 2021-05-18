
var last, delta;
var keys = [];      //keys currently held down
var scene;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const socket = io(); 

function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	//console.log(mouse);
}


function main() {
	window.addEventListener( 'mousemove', onMouseMove, false );
	const canvas = document.querySelector('#c');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	const renderer = new THREE.WebGLRenderer({canvas});

	const selected = new THREE.MeshLambertMaterial({color: 0xff0000});  // greenish blue "black pieces"


	const fov = 75;
	const aspect = canvas.width / canvas.height;  // the canvas default
	const near = 0.1;
	const far = 50;
	const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.x = square_dims * 4;
	camera.position.y = -square_dims * 1;
	camera.position.z = 7;
	camera.lookAt(square_dims*4,square_dims*4,0);

	setup_resize_listener(camera, renderer);

	scene = new THREE.Scene();

	setup_board(scene);
	setupLights(scene);
	pieces_loader.load();
	let loop = function() {
		// update the picking ray with the camera and mouse position
		raycaster.setFromCamera( mouse, camera );

		// calculate objects intersecting the picking ray
		let intersects = raycaster.intersectObjects( scene.children );
		let oldmaterial = null;
		let intersectobj = null;

		if(intersects.length >= 1){
			intersectobj = intersects[ 0 ].object;
			oldmaterial = intersectobj.material;
			intersectobj.material = selected;
		}
		renderer.render(scene, camera);
		if(oldmaterial != null)
			intersects[ 0 ].object.material = oldmaterial;
		
		window.requestAnimationFrame(loop);
	}
	window.requestAnimationFrame(loop);
	
}
document.body.onload = main;

var isMouseDown = false;
function setup_input(cam) {

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