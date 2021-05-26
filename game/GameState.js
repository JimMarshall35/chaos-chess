const defs = require("./defs.js");

class GameState{

	constructor(){
		this._state        = JSON.parse(JSON.stringify(defs.initial_state)); 
		this.moving_pieces = [];
		this.speed         = 300; // 1 square takes 300 ms
	}
	tryMove(roomname, move){
		// to test - no checking for correct move
		console.log("room "+roomname+" tried move: ",move);
		for(let i=0; i<this._state.pieces.length; i++){
			let piece = this._state.pieces[i];
			if(piece.square_moving_to       == null        &&
			   piece.square_moving_from.col == move[0].col &&
			   piece.square_moving_from.row == move[0].row){
				this._state.pieces[i].square_moving_to = move[1];
				let start = {
					x : defs.cols[piece.square_moving_from.col] ,
					y : (piece.square_moving_from.row -1) 
				};
				let finish = {
					x : defs.cols[piece.square_moving_to.col] ,
					y : (piece.square_moving_to.row -1) 
				};
				let distance = Math.sqrt((finish.x-start.x)*(finish.x-start.x) + (finish.y - start.y)* (finish.y - start.y));
				
				this.moving_pieces.push({
				   	 timer    : 0,
					 movetime : distance * this.speed,        
					 name     : piece.name
				});
				break;
			}
		}
		console.log(roomname, this.moving_pieces);
		//console.log(roomname, this._state);
		
	}
	update(roomname,io,delta){
		let moving_pieces_todelete = [];
		for (var i = 0; i < this.moving_pieces.length; i++) {
			let piece       =  this.moving_pieces[i];
			piece.timer     += delta;
			let state_piece = null;
			for(let j=0; j<this._state.pieces.length; j++){
				if(this._state.pieces[j].name == piece.name){
					this._state.pieces[j].t = piece.timer / piece.movetime;
					state_piece = this._state.pieces[j];
				}
			}
			if(piece.timer >= piece.movetime){
				let to                         = state_piece.square_moving_to;
				state_piece.square_moving_from = {col : to.col, row : to.row};
				state_piece.square_moving_to   = null;
				state_piece.t                  = 0;
				moving_pieces_todelete.push(i); // don't splice them mid-loop
			}

		}//
		for (var i = 0; i < moving_pieces_todelete.length; i++) {
			this.moving_pieces.splice(moving_pieces_todelete[i],1);
		}
		io.to(roomname).emit("update",this._state);
	}
}
module.exports = {GameState}