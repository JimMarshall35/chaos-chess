
var last, delta;

var scene;
var keys          = [];      //keys currently held down
const raycaster   = new THREE.Raycaster();
const mouse       = new THREE.Vector2();
const socket      = io(); 
var loading_ready = false;
var game_ready    = false;
var isPlayer      = PLAYER1;

socket.on("opponent_disconnected",()=>{
	let opponenth1 = document.getElementById("opponent-h1");
	console.log("opponent disconnected");
	opponenth1.style.display = "block";
	game_ready = false;
});
socket.on("set_room",(code)=>{
	let codeh2 = document.getElementById("code-h2");
	codeh2.innerHTML = code;
});
socket.on("successful_join", ()=>{
	let inpt = document.getElementById("code-input-div");
	inpt.style.display = "none";
	game_ready         = true;
	isPlayer           = PLAYER2;
});
socket.on("room_full", ()=>{
	let errorh2 = document.getElementById("error-h2");
	errorh2.innerHTML = "room full";
});
socket.on("invalid_room_code", ()=>{
	let errorh2 = document.getElementById("error-h2");
	errorh2.innerHTML = "invalid code";
});
socket.on("update",(state)=>{
	if(game_ready){
		setPositions(state);
	}
});

function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	//console.log(mouse);
}

function codeSubmit(){
	let code = document.getElementById("code-input").value;
	socket.emit("code_input",code);
}

function onReady(argument) {
	loading_ready         = true;
	let spinner           = document.getElementById("loading-spinner");
	let inpt              = document.getElementById("code-input-div");
	spinner.style.display = "none";
	inpt.style.display    = "block";
	socket.emit("loading_ready");
}

function main() {
	window.addEventListener( 'mousemove', onMouseMove, false );
	const canvas      = document.querySelector('#c');
	canvas.width      = window.innerWidth;
	canvas.height     = window.innerHeight;
	const renderer    = new THREE.WebGLRenderer({canvas});
	const selected    = new THREE.MeshLambertMaterial({color: 0xff0000});  // greenish blue "black pieces"
	const fov         = 75;
	const aspect      = canvas.width / canvas.height;  // the canvas default
	const near        = 0.1;
	const far         = 50;
	const camera      = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.x = square_dims * 4;
	camera.position.y = -square_dims * 1;
	camera.position.z = 7;
	camera.lookAt(square_dims*4,square_dims*4,0);

	setup_resize_listener(camera, renderer);

	scene = new THREE.Scene();

	setup_board(scene);
	setupLights(scene);
	pieces_loader.load();

	let intersectobj = null;

	window.addEventListener("mousedown",(e)=>{onMouseClick(e,intersectobj)});
	let loop = function() {
		if(loading_ready){
			// update the picking ray with the camera and mouse position
			raycaster.setFromCamera( mouse, camera );
			if(game_ready){
				// calculate objects intersecting the picking ray
				let intersects = raycaster.intersectObjects( scene.children );
				let oldmaterial = null;
				

				if(intersects.length >= 1){
					for(let i=0; i<intersects.length; i++){
						let intersect = intersects[i];
						if(intersect.object.userData.type == OBJ_TYPE.SQUARE){
							intersectobj          = intersect.object;
							oldmaterial           = intersectobj.material;
							intersectobj.material = selected;
							break;
						}
					}
					
				}
				renderer.render(scene, camera);
				if(oldmaterial != null)
					intersectobj.material = oldmaterial;
				}
				
			}

		
		
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
var chosen_squares = [];
function onMouseClick(e,intersectobj){
	if(loading_ready && intersectobj){
		chosen_squares.push(intersectobj.userData);
		console.log(chosen_squares);
		if(chosen_squares.length == 2){
			socket.emit("move_input",chosen_squares, isPlayer);
			chosen_squares = [];
		}
	}
	
}
