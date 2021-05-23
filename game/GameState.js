const defs = require("./defs.js");

class GameState{

	constructor(){
		this._state        = defs.initial_state; 
		this.moving_pieces = [];
	}
	tryMove(roomname, move){
		console.log("room "+roomname+" tried move: ",move);
		
	}
	update(roomname,io){
		io.to(roomname).emit(this._state);
	}
}
module.exports = {GameState}