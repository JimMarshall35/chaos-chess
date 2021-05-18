const square_dims = 1.0;

const material1 = new THREE.MeshLambertMaterial({color: 0x44aa88});  // greenish blue "black pieces"
const material2 = new THREE.MeshLambertMaterial({color: 0xaaff12});  // "white pieces"
function setup_board(scene) {
	// make the actual chess board
	const boxWidth = 1;
	const boxHeight = 1;
	const boxDepth = 1;
	const geometry = new THREE.BoxGeometry(square_dims, boxHeight, square_dims);

	let onsquare = 0;

	for(let row = 0; row<8; row++){
		for(let col = 0; col<8; col++){
			let material = (onsquare % 2) ? material1 : material2;
			const cube = new THREE.Mesh(geometry, material);
			cube.position.x = row * square_dims;
			cube.position.y = col * square_dims;
			cube.position.z = 0;
			onsquare++;
			scene.add(cube);
		}
		onsquare++;
	}
}


