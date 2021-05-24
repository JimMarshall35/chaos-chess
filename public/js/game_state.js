
function setPositions(state){
	for(let i=0; i<state.pieces.length; i++){
		let state_piece   = state.pieces[i];
		let piece_gameobj = pieces_loader.pieces[state_piece.name];
		if(state_piece.square_moving_to == null){
			piece_gameobj.position.y = (state_piece.square_moving_from.row -1)  * square_dims;
			piece_gameobj.position.x = cols[state_piece.square_moving_from.col] * square_dims;
		}
		else{

			let start = new THREE.Vector2(
				cols[state_piece.square_moving_from.col] * square_dims,
				(state_piece.square_moving_from.row -1)  * square_dims
			);
			let finish = new THREE.Vector2(
				cols[state_piece.square_moving_to.col] * square_dims,
				(state_piece.square_moving_to.row -1)  * square_dims
			);
			let t = state_piece.t;
			console.log(t);
			let lerped = new THREE.Vector2().lerpVectors(start,finish,t); // have bezier curve interpolation for knights
			piece_gameobj.position.x = lerped.x;
			piece_gameobj.position.y = lerped.y;
		}
		
		
	}
}


var state = initial_state;