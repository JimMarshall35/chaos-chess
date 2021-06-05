function returnPlayerOfPieceType(piecetype){
	// returns defs.PLAYER1 or defs.PLAYER2
	if(piecetype == null){
		return null;
	}
	if(white_pieces.includes(piecetype)){
		return PLAYER1;
	}
	else if(black_pieces.includes(piecetype)){
		return PLAYER2;
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
function getPieceAtSquare(square){
		if(square == null){
			//console.log("square null");
			return null;
		}
		for(let i=0; i<updated_state.pieces.length; i++){
			let piece = updated_state.pieces[i];
			if(!piece.in_play){
				continue;
			}
			if(piece.square_moving_to != null){
				continue;
			}
			if(piece.square_moving_from.col == square.col && 
				piece.square_moving_from.row == square.row){
				//console.log(updated_state.pieces[i])
				return updated_state.pieces[i];
			}
		}
		//console.log("no piece");
		return null;
	}
function setPositions(state){
	updated_state = state;
	const z = 1;
	for(let i=0; i<state.pieces.length; i++){
		let state_piece   = state.pieces[i];
		let piece_gameobj = pieces_loader.pieces[state_piece.name];
		if(state_piece.square_moving_to == null){
			piece_gameobj.position.y = (state_piece.square_moving_from.row -1)  * square_dims;
			piece_gameobj.position.x = cols[state_piece.square_moving_from.col] * square_dims;
			piece_gameobj.position.z = 1;
		}
		else{
			// get world space vectors for the start and finish square of the move
			let start = new THREE.Vector3(
				cols[state_piece.square_moving_from.col] * square_dims,
				(state_piece.square_moving_from.row -1)  * square_dims,
				z
			);
			let finish = new THREE.Vector3(
				cols[state_piece.square_moving_to.col] * square_dims,
				(state_piece.square_moving_to.row -1)  * square_dims,
				z
			);
			// interpolate position based on t
			let t = state_piece.t;
			let lerped;
			let piece_type = getPieceType(state_piece);
			if(piece_type == "♘" || piece_type == "♞"){
				// knights move along a bezier curve to jump
				const curve = new THREE.CubicBezierCurve3(
					start,
					new THREE.Vector3(start.x,  start.y,  z + KNIGHT_JUMP_HEIGHT),
					new THREE.Vector3(finish.x, finish.y, z + KNIGHT_JUMP_HEIGHT),
					finish
				);
				lerped = curve.getPoint(t);
			}
			else{
				// other pieces slide
				lerped = new THREE.Vector3().lerpVectors(start,finish,t); 

			}
			// set THREE.js object position
			piece_gameobj.position.x = lerped.x;
			piece_gameobj.position.y = lerped.y;
			piece_gameobj.position.z = lerped.z;
		}
		
		
	}
}

var updated_state = null;