
var last, delta;

var scene;
var keys          = [];      //keys currently held down
const raycaster   = new THREE.Raycaster();
const mouse       = new THREE.Vector2();
var socket;
var loading_ready = false;
var game_ready    = false;
var isPlayer      = PLAYER1;
var meshes        = [];
var joinable      = [];
var roomcode;

function setupSocket(socket){
	socket.on("opponent_disconnected",()=>{
		let opponenth1 = document.getElementById("opponent-h1");
		console.log("opponent disconnected");
		opponenth1.style.display = "block";
		game_ready = false;
	});
	socket.on("set_room",(code,name)=>{
		let codeh2 = document.getElementById("code-h2");
		let nameinput = document.getElementById("name-input");
		codeh2.innerHTML = code;
		nameinput.value  = name;
		roomcode = code;
	});
	socket.on("successful_join", (opponent_name)=>{
		console.log(opponent_name);
		let inpt = document.getElementById("code-input-div");
		inpt.style.display = "none";
		let opponenth2 = document.getElementById("opponent-name-h2");
		opponenth2.textContent = "Playing: " + opponent_name;
		opponenth2.style.display = "block";
		game_ready         = true;
		canvas.style.visibility = "visible";
		setCameraDistance(camera,scene);
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
	socket.on("make_player_2",()=>{
		isPlayer = PLAYER2;
		camera.setRotationFromEuler(new THREE.Euler(0,0,0));
		camera.position   = new THREE.Vector3(0,0,0);
		camera.position.x = square_dims * 3.5;
		camera.position.y = square_dims * 3.5 + square_dims*4;
		camera.position.z = 7;
		camera.rotateOnWorldAxis(new THREE.Vector3(0,0,1), Math.PI);
		camera.rotateOnWorldAxis(new THREE.Vector3(-1,0,0), Math.PI/8);
		camera.updateProjectionMatrix();	
	});
	socket.on("winner",(winner)=>{
		let msg;
		if(winner == isPlayer){
			msg = "You Win!";
		}
		else{
			msg = "You Lose!";
		}
		let opponenth1 = document.getElementById("opponent-h1");
		console.log(winner);
		opponenth1.style.display = "block";
		opponenth1.textContent = msg;
		//game_ready = false;
	});
	socket.on("joinable_change",(joinable_players)=>{
		if(!game_ready){
			joinable = joinable_players;
			createGamesListDOM(joinable_players);
		}
	});
}


function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	//console.log(mouse);
}
function nameChange() {
	let name = document.getElementById("name-input").value;
	socket.emit("name_change", name);
}
function codeSubmit(){
	let code = document.getElementById("code-input").value;
	socket.emit("code_input",code);
}
let authenticated = false;
let loaded_before_authenticated = false;
function onReady(argument) {
	loading_ready         = true;
	let spinner           = document.getElementById("loading-div");
	spinner.style.display = "none";
	if(authenticated){
		let inpt              = document.getElementById("code-input-div");
		inpt.style.display    = "block";
		socket = io(); 
		setupSocket(socket);
		socket.emit("loading_ready");
	}
	else{
		loaded_before_authenticated = true;
	}
	
	
}
function loadSkyBox(scene){
	let sloader = new THREE.CubeTextureLoader();
	let texture = sloader.load([
    	
    	skybox_front,
    	skybox_back,
    	skybox_up,
    	skybox_down,
    	skybox_right,
    	skybox_left
    	
    ]);
    scene.background = texture;
}
var camera;
var selected;
var canvas;
function main() {
	
	initGamesListDom();
	canvas      = document.querySelector('#c');
	canvas.width      = window.innerWidth;
	canvas.height     = window.innerHeight;
	const renderer    = new THREE.WebGLRenderer({canvas});
	selected          = new THREE.MeshLambertMaterial({color: 0xff0000});  // greenish blue "black pieces"
	const fov         = 75;
	const aspect      = canvas.width / canvas.height;  // the canvas default
	const near        = 0.1;
	const far         = 50;
	camera            = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.setRotationFromEuler(new THREE.Euler(0,0,0));
	camera.position   = new THREE.Vector3(0,0,0);
	camera.position.x = square_dims * 3.5;
	camera.position.y = square_dims * 3.5 - square_dims*4;
	camera.position.z = 7;
	camera.rotateOnWorldAxis(new THREE.Vector3(1,0,0), Math.PI/8);
	camera.updateProjectionMatrix();
	//camera.lookAt(square_dims*4,square_dims*4,0);
	setupListeners(camera, renderer)


	scene = new THREE.Scene();

	loadSkyBox(scene);
	setup_board(scene);
	setupLights(scene);
	pieces_loader.load();

	let loop = function() {
		if(loading_ready){
			if(game_ready){
				renderer.render(scene, camera);
			}
		}
		window.requestAnimationFrame(loop);
	}
	window.requestAnimationFrame(loop);
	
}
document.body.onload = main;

var isMouseDown = false;



function setupLights(scene) {
	const light = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add( light );
	const plight = new THREE.PointLight( 0x404040, 2, 100 );
	plight.position.set( square_dims*4, square_dims*4, square_dims*4 );
	scene.add( plight );

}
var chosen_squares = [];
let firstsquare    = null;
function onMouseClick(e){
	let intersectobj = raycast();
	if(loading_ready && intersectobj){
		switch(chosen_squares.length){
			case 0:
				if(getPiecePlayer(intersectobj.piece) == isPlayer ){
					firstsquare              = intersectobj;
					firstsquare.oldmaterial  = intersectobj.obj.material;
					firstsquare.obj.material = selected;
					chosen_squares.push({row : intersectobj.obj.userData.row, col : intersectobj.obj.userData.col});
				}
				break;
			case 1:
				if(getPiecePlayer(intersectobj.piece) == isPlayer){
					chosen_squares[0]              = {row : intersectobj.obj.userData.row, col : intersectobj.obj.userData.col};
					firstsquare.obj.material = firstsquare.oldmaterial;
					firstsquare = intersectobj;
					firstsquare.oldmaterial  = intersectobj.obj.material;
					firstsquare.obj.material = selected;
					break;
				}
				chosen_squares.push({row : intersectobj.obj.userData.row, col : intersectobj.obj.userData.col});
				firstsquare.obj.material = firstsquare.oldmaterial;
				firstsquare = null;
				socket.emit("move_input",chosen_squares, isPlayer);
				chosen_squares = [];
				break;

		}
		
		//console.log(chosen_squares);
		//console.log(client_squares);
	}
	
}
function raycast() {
	// update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );
	// calculate objects intersecting the picking ray

	let intersects = raycaster.intersectObjects( scene.children );
	let oldmaterial = null;
	

	if(intersects.length >= 1){
		for(let i=0; i<intersects.length; i++){
			let intersect = intersects[i];
			if(intersect.object.userData.type == OBJ_TYPE.SQUARE){
				let piece = getPieceAtSquare(intersect.object.userData);
				let oldmaterial = intersect.object.material;
				return {obj : intersect.object, oldmaterial : oldmaterial, piece : piece};
			}
		}
	}
	return null;
}

function setupListeners(camera, renderer) {
	window.addEventListener('touchmove', ev => { // prevent default touch behavior on mobile
	    ev.preventDefault();
	    ev.stopImmediatePropagation();

	}, { passive: false });
	function setup_resize_listener(cam, renderer) {
		window.addEventListener("resize",()=>{
			renderer.setSize(window.innerWidth,window.innerHeight);
			cam.aspect = window.innerWidth / window.innerHeight;
			cam.updateProjectionMatrix();
		});
	}
	window.addEventListener( 'mousemove', onMouseMove, false );
	window.addEventListener("mousedown",onMouseClick);
	window.addEventListener("touchstart",(e)=>{
		e.preventDefault();
		let touch = e.touches[0];
		onMouseMove(touch);
		onMouseClick();
	});
	setup_resize_listener(camera,renderer);
	window.addEventListener('wheel', (e)=>{
		e.preventDefault();
		handleMouseWheel(e);
	});
}
function handleMouseWheel(e) {
	//e.preventDefault();
	let board_center = new THREE.Vector3(square_dims * 3.5, square_dims * 3.5, 0);
	let direction = new THREE.Vector3().subVectors(camera.position,board_center);
	direction.normalize();
	direction.multiplyScalar(0.01 * e.deltaY);
	camera.position.add(direction);
	//console.log(camera.position);
	camera.updateProjectionMatrix();
	console.log(e.deltaY);
	console.log(checkSceneInView(scene,camera));
}
function checkSceneInView(scene,camera) {
	var frustum = new THREE.Frustum();
	frustum.setFromProjectionMatrix( new THREE.Matrix4().multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse ) );
	let corners =[
	/*
		new THREE.Vector3(-square_dims/2                   ,-square_dims/2                  ,0),
		new THREE.Vector3(-square_dims/2                   ,-square_dims/2 + square_dims *8 ,0),
		new THREE.Vector3(-square_dims/2 + square_dims *8  ,-square_dims/2 + square_dims *8 ,0),
		new THREE.Vector3(-square_dims/2 + square_dims *8  ,-square_dims/2                  ,0),
		*/
		new THREE.Vector3(0,8,0),
		new THREE.Vector3(8,0,0),
		new THREE.Vector3(8,8,0),
		new THREE.Vector3(0,0,0)
	];
	for(let i=0; i<corners.length; i++){
		let corner = corners[i];
		if(!frustum.containsPoint(corner)){
			console.log(false);
			return false;
		}

	}
	console.log(true);
	//if(frustum.containsPoint(new THREE.Vector3(-15,-15,0))){return false;}
	return true
}
function setCameraDistance(camera,scene) {
	// makes sure the whole board is visible on phones
	let board_center = new THREE.Vector3(square_dims * 3.5, square_dims * 3.5, 0);
	let spins = 0;
	
	let inview = checkSceneInView(scene,camera);
	while(!inview){
		inview = checkSceneInView(scene,camera);
		handleMouseWheel({deltaY : DISTANCE_SET_INCR});
		camera.updateMatrix();
		camera.updateWorldMatrix();
	}
}