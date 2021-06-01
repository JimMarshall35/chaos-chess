function returnPlayerOfPieceType(piecetype){
	// returns defs.PLAYER1 or defs.PLAYER2
	if(piecetype == null){
		return null;
	}
	if(defs.white_pieces.includes(piecetype)){
		return defs.PLAYER1;
	}
	else if(defs.black_pieces.includes(piecetype)){
		return defs.PLAYER2;
	}
}
function getPieceType(piece){
	// returns the unicode symbol for the piece 
	if(piece == null){
		return null;
	}
	if(piece.name.length == 1)
    	return piece.name;
    else
    	return piece.name[1];
}
function getPiecePlayer(piece){
	return returnPlayerOfPieceType(getPieceType(piece));
}
function setPositions(state){
	for(let i=0; i<state.pieces.length; i++){
		let state_piece   = state.pieces[i];
		let piece_gameobj = pieces_loader.pieces[state_piece.name];
		if(state_piece.square_moving_to == null){
			piece_gameobj.position.y = (state_piece.square_moving_from.row -1)  * square_dims;
			piece_gameobj.position.x = cols[state_piece.square_moving_from.col] * square_dims;
			piece_gameobj.position.z = 1;
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
			let piece_type = getPieceType(state_piece);
			let lerped;
			let z = 1;
			if(piece_type == "♘" || piece_type == "♞"){
				const curve = new THREE.CubicBezierCurve3(
					new THREE.Vector3(start.x, start.y, z),
					new THREE.Vector3(start.x, start.y, z+KNIGHT_JUMP_HEIGHT),
					new THREE.Vector3(finish.x,finish.y,z+KNIGHT_JUMP_HEIGHT),
					new THREE.Vector3(finish.x,finish.y,z)
				);
				lerped = curve.getPoint(t);
			}
			else{
				lerped = new THREE.Vector3().lerpVectors(start,finish,t); 
				lerped.z = z;
			}
			
			piece_gameobj.position.x = lerped.x;
			piece_gameobj.position.y = lerped.y;
			piece_gameobj.position.z = lerped.z;
		}
		
		
	}
}


var state = initial_state;