const defs = require("./defs.js");
class MovingPiece{
	constructor(movetime,name){
		this.timer    = 0;
		this.movetime = movetime;
		this.name     = name;
	}
	update(delta,_state){
		this.timer     += delta;
		let state_piece = null;
		for(let j=0; j<_state.pieces.length; j++){
			if(_state.pieces[j].name == this.name){
				_state.pieces[j].t = this.timer / this.movetime;
				state_piece = _state.pieces[j];
			}
		}
		if(this.timer >= this.movetime){
			let to                         = state_piece.square_moving_to;
			state_piece.square_moving_from = {col : to.col, row : to.row};
			state_piece.square_moving_to   = null;
			state_piece.t                  = 0;
			return true;
		}
		return false;
	}
}
class GameState{

	constructor(){
		this._state        = JSON.parse(JSON.stringify(defs.initial_state)); // "deep copy" of initial_state
		this.moving_pieces = [];
		this.speed         = 300; // 1 square takes 300 ms
	}
	checkRookMove  (move,piece){return true;}
	checkKnightMove(move,piece){return true;}
	checkBishopMove(move,piece){return true;}
	checkQueenMove (move,piece){return true;}
	checkKingMove  (move,piece){return true;}
	checkPawnMove  (move,piece){return true;}

	tryMove(roomname, move){
		// to test - no checking for correct move
		console.log("room "+roomname+" tried move: ",move);
		for(let i=0; i<this._state.pieces.length; i++){
			let piece = this._state.pieces[i];

			if(piece.square_moving_to       == null        && // if the piece is the one that's been chosen to move
			   piece.square_moving_from.col == move[0].col &&
			   piece.square_moving_from.row == move[0].row){
			   	// need to check whether the player is trying to move the right colour of piece here

				/* check for valid move here, if move invalid, break */
				let moveallowed = true;
				switch(piece.name[1]){
					case "♖":
					case "♜":
						if(!this.checkRookMove(move,piece)){
							moveallowed = false;
						}
						break;
					case "♘":
					case "♞":
						if(!this.checkKnightMove(move,piece)){
							moveallowed = false;
						}
						break;
					case "♗":
					case "♝":
						if(!this.checkBishopMove(move,piece)){
							moveallowed = false;
						}
						break;
					case "♕":
					case "♛":
						if(!this.checkQueenMove(move,piece)){
							moveallowed = false;
						}
						break;
					case "♔":
					case "♚":
						if(!this.checkKingMove(move,piece)){
							moveallowed = false;
						}
						break;
					case "♙":
					case "♟":
						if(!this.checkPawnMove(move,piece)){
							moveallowed = false;
						}
						break;
				}
				if(moveallowed == false){
					break;
				}

			   	// then push an object to 'moving pieces'
				this._state.pieces[i].square_moving_to = move[1];
				let start = {
					x : defs.cols[piece.square_moving_from.col],
					y : (piece.square_moving_from.row -1) 
				};
				let finish = {
					x : defs.cols[piece.square_moving_to.col],
					y : (piece.square_moving_to.row -1) 
				};
				let distance = Math.sqrt((finish.x-start.x)*(finish.x-start.x) + (finish.y - start.y)* (finish.y - start.y));
				
				this.moving_pieces.push(new MovingPiece(distance * this.speed, piece.name));
				break;
			}
		}
		console.log(roomname, this.moving_pieces);
		
	}
	update(roomname,io,delta){
		let moving_pieces_todelete = [];
		for (var i = 0; i < this.moving_pieces.length; i++) {
			let piece       =  this.moving_pieces[i];
			if(piece.update(delta,this._state)){
				moving_pieces_todelete.push(i);
			}

		}
		for (var i = 0; i < moving_pieces_todelete.length; i++) {
			this.moving_pieces.splice(moving_pieces_todelete[i],1);
		}
		io.to(roomname).emit("update",this._state);
	}
}
module.exports = {GameState}
