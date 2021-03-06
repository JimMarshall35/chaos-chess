

const skybox_front = "images/skyboxes/tron_ft.png";
const skybox_back = "images/skyboxes/tron_bk.png";
const skybox_up = "images/skyboxes/tron_up.png";
const skybox_down = "images/skyboxes/tron_dn.png";
const skybox_right = "images/skyboxes/tron_rt.png";
const skybox_left = "images/skyboxes/tron_lf.png";

const NONE               = 0
const PLAYER1            = 1;
const PLAYER2            = 2;
const KNIGHT_JUMP_HEIGHT = 2;
const DISTANCE_SET_INCR  = 51;
const OBJ_TYPE = {
	SQUARE : 0,
	PIECE  : 1
}
const black_pieces = ["♚","♛","♝","♞","♜","♟"];
const white_pieces = ["♔","♕","♗","♘","♖","♙"];
const cols = {
	a : 0,
	b : 1,
	c : 2,
	d : 3,
	e : 4,
	f : 5,
	g : 6,
	h : 7
	// lookup table to translate from chess notation to a number
}
const col_names = ["a","b","c","d","e","f","g","h"];
const initial_state ={
	pieces : [
		// white non pawns
		{ 
			name : "a♖",
			square_moving_to : null,                   // square the piece is moving to, null if stationary
			square_moving_from : {col : 'a', row : 1}, // column and row are in chess notation, row starts from 1
			t : 0,                                     // proportion of the way to next square, between 0 and 1
			in_play : true                             // has the piece been taken?
		},
		{ 
			name : "b♘",
			square_moving_to : null,
			square_moving_from : {col : 'b', row : 1},
			t : 0,
			in_play : true
		},
		{ 
			name : "c♗",
			square_moving_to : null,
			square_moving_from : {col : 'c', row : 1},
			t : 0,
			in_play : true
		},
		{ 
			name : "♕",
			square_moving_to : null,
			square_moving_from : {col : 'd', row : 1},
			t : 0,
			in_play : true
		},
		{ 
			name : "♔",
			square_moving_to : null,
			square_moving_from : {col : 'e', row : 1},
			t : 0,
			in_play : true
		},
		
		
		{ 
			name : "f♗",
			square_moving_to : null,
			square_moving_from : {col : 'f', row : 1},
			t : 0,
			in_play : true
		},
		
		{ 
			name : "g♘",
			square_moving_to : null,
			square_moving_from : {col : 'g', row : 1},
			t : 0,
			in_play : true
		},
		
		{ 
			name : "h♖",
			square_moving_to : null,
			square_moving_from : {col : 'h', row : 1},
			t : 0,
			in_play : true
		},
		// white pawns
		{ 
			name : "a♙",
			square_moving_to : null,
			square_moving_from : {col : 'a', row : 2},
			t : 0,
			in_play : true
		},
		{ 
			name : "b♙",
			square_moving_to : null,
			square_moving_from : {col : 'b', row : 2},
			t : 0,
			in_play : true
		},
		{ 
			name : "c♙",
			square_moving_to : null,
			square_moving_from : {col : 'c', row : 2},
			t : 0,
			in_play : true
		},
		{ 
			name : "d♙",
			square_moving_to : null,
			square_moving_from : {col : 'd', row : 2},
			t : 0,
			in_play : true
		},
		{ 
			name : "e♙",
			square_moving_to : null,
			square_moving_from : {col : 'e', row : 2},
			t : 0,
			in_play : true
		},
		
		
		{ 
			name : "f♙",
			square_moving_to : null,
			square_moving_from : {col : 'f', row : 2},
			t : 0,
			in_play : true
		},
		
		{ 
			name : "g♙",
			square_moving_to : null,
			square_moving_from : {col : 'g', row : 2},
			t : 0,
			in_play : true
		},
		
		{ 
			name : "h♙",
			square_moving_to : null,
			square_moving_from : {col : 'h', row : 2},
			t : 0,
			in_play : true
		},
		// black non pawns
		{ 
			name : "a♜",
			square_moving_to : null,
			square_moving_from : {col : 'a', row : 8},
			t : 0,
			in_play : true
		},
		{ 
			name : "b♞",
			square_moving_to : null,
			square_moving_from : {col : 'b', row : 8},
			t : 0,
			in_play : true
		},
		{ 
			name : "c♝",
			square_moving_to : null,
			square_moving_from : {col : 'c', row : 8},
			t : 0,
			in_play : true
		},
		{ 
			name : "♛",
			square_moving_to : null,
			square_moving_from : {col : 'd', row : 8},
			t : 0,
			in_play : true
		},
		{ 
			name : "♚",
			square_moving_to : null,
			square_moving_from : {col : 'e', row : 8},
			t : 0,
			in_play : true
		},
		
		
		{ 
			name : "f♝",
			square_moving_to : null,
			square_moving_from : {col : 'f', row : 8},
			t : 0,
			in_play : true
		},
		
		{ 
			name : "g♞",
			square_moving_to : null,
			square_moving_from : {col : 'g', row : 8},
			t : 0,
			in_play : true
		},
		
		{ 
			name : "h♜",
			square_moving_to : null,
			square_moving_from : {col : 'h', row : 8},
			t : 0,
			in_play : true
		},
		//black pawns
		{ 
			name : "a♟",
			square_moving_to : null,
			square_moving_from : {col : 'a', row : 7},
			t : 0,
			in_play : true
		},
		{ 
			name : "b♟",
			square_moving_to : null,
			square_moving_from : {col : 'b', row : 7},
			t : 0,
			in_play : true
		},
		{ 
			name : "c♟",
			square_moving_to : null,
			square_moving_from : {col : 'c', row : 7},
			t : 0,
			in_play : true
		},
		{ 
			name : "d♟",
			square_moving_to : null,
			square_moving_from : {col : 'd', row : 7},
			t : 0,
			in_play : true
		},
		{ 
			name : "e♟",
			square_moving_to : null,
			square_moving_from : {col : 'e', row : 7},
			t : 0,
			in_play : true
		},
		
		
		{ 
			name : "f♟",
			square_moving_to : null,
			square_moving_from : {col : 'f', row : 7},
			t : 0,
			in_play : true
		},
		
		{ 
			name : "g♟",
			square_moving_to : null,
			square_moving_from : {col : 'g', row : 7},
			t : 0,
			in_play : true
		},
		
		{ 
			name : "h♟",
			square_moving_to : null,
			square_moving_from : {col : 'h', row : 7},
			t : 0,
			in_play : true
		}

	]
}
