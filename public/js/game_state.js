
function setPositions(state){
	for(let i=0; i<state.pieces.length; i++){
		let state_piece = state.pieces[i];
		let piece_gameobj = pieces_loader.pieces[state_piece.name];

		////////// to test //////
		// final implementation will interpolate position according to state_piece.t if state_piece.square_moving_to is not null
		// interpolate either linearly for the sliding pieces or along a bezier curve for the knights which "jump"
		piece_gameobj.position.y = (state_piece.square_moving_from.row -1) * square_dims;
		piece_gameobj.position.x = cols[state_piece.square_moving_from.col] * square_dims;
		
	}
}


var state = initial_state;