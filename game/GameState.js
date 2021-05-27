const defs = require("./defs.js");

class MovingPiece{
	constructor(movetime,name, game){
		this.timer    = 0;        // current time value
		this.movetime = movetime; // total time before timer gets deleted and piece finishes its move
		this.name     = name;     // name of piece that's moving
		this.game     = game;
	}
	update(delta){
		let pieces      = this.game.state.pieces;
		this.timer      += delta;
		let state_piece = null;
		for(let j=0; j<pieces.length; j++){
			if(pieces[j].name == this.name){
				pieces[j].t = this.timer / this.movetime;
				state_piece = pieces[j];
				break;
			}
		}
		if(this.timer >= this.movetime){
			this.finishMove(state_piece);
			return true;
		}
		return false;
	}
	finishMove(state_piece){
		let to                         = state_piece.square_moving_to;
		state_piece.square_moving_from = {col : to.col, row : to.row};
		state_piece.square_moving_to   = null;
		state_piece.t                  = 0;
		this.game.checkTake(state_piece);
	}
}
class GameState{

	constructor(){
		this.state        = JSON.parse(JSON.stringify(defs.initial_state)); // "deep copy" of initial_state
		this.moving_pieces = [];
		this.speed         = 300; // 1 square takes 300 ms
	}
	checkRookMove  (move,piece){return true;}
	checkKnightMove(move,piece){return true;}
	checkBishopMove(move,piece){return true;}
	checkQueenMove (move,piece){return true;}
	checkKingMove  (move,piece){return true;}
	checkPawnMove  (move,piece){return true;}

	tryMove(roomname, move, player){
		let playername;                           // to print
		if     (player == defs.PLAYER1){
			playername = "player 1";
		}
		else if(player == defs.PLAYER2){
			playername = "player 2";
		}
		else{
			playername = "player name error";
		}
		console.log("room "+roomname+" player: "+playername+" tried move: ",move);

		for(let i=0; i<this.state.pieces.length; i++){
			let piece = this.state.pieces[i];

			if(piece.square_moving_to       == null        && // if the piece is the one that's been chosen to move
			    piece.square_moving_from.col == move[0].col &&
			    piece.square_moving_from.row == move[0].row){
			    /* check whether the player is trying to move the right colour of piece here */
			    let moveallowed = true;
			    let piecetype;
			    if(piece.name.length == 1)
			    	piecetype = piece.name;
			    else
			    	piecetype = piece.name[1];
			    
			    switch(player){
			    	case defs.PLAYER1:
			    		if(!defs.white_pieces.includes(piecetype)){
			    			console.log(piecetype);
			    			console.log("tried to move the opponents piece");
			    			moveallowed = false;
			    		}
			    		break;
			    	case defs.PLAYER2:
			    		if(!defs.black_pieces.includes(piecetype)){
			    			console.log(piecetype);
			    			console.log("tried to move the opponents piece");
			    			moveallowed = false;
			    		}
			    		break;
			    	default:
			    		break;
			    }
			    if(!moveallowed){
			    	break;
			    }
				/* check for valid move here, if move invalid, break */
				
				switch(piecetype){
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
				if(!moveallowed){
					break;
				}

			   	// then push an object to 'moving pieces'
				this.state.pieces[i].square_moving_to = move[1];
				let start = {
					x : defs.cols[piece.square_moving_from.col], // convert from letter to column index
					y : (piece.square_moving_from.row -1)        // convert from row number (starts at 1) to row index
				};
				let finish = {
					x : defs.cols[piece.square_moving_to.col],
					y : (piece.square_moving_to.row -1) 
				};
				let distance = Math.sqrt((finish.x-start.x)*(finish.x-start.x) + (finish.y - start.y)* (finish.y - start.y));
				
				this.moving_pieces.push(
					new MovingPiece(
							distance * this.speed, // movement speed
							piece.name,            // name of piece
							this                   
						)
					);
				console.log("move successful");
				break;
			}
			if(i == this.state.pieces.length-1){
				console.log("no piece selected");
			}
		}
		console.log("\n");
		
	}
	update(roomname,io,delta){
		let moving_pieces_todelete = [];
		for (var i = 0; i < this.moving_pieces.length; i++) {
			let piece       =  this.moving_pieces[i];
			if(piece.update(delta,this.state)){
				moving_pieces_todelete.push(i);
			}

		}
		for (var i = 0; i < moving_pieces_todelete.length; i++) {
			this.moving_pieces.splice(moving_pieces_todelete[i],1);
		}
		io.to(roomname).emit("update",this.state);
	}

	checkTake(piece_finished){
		/* 
			will check if the peice that's 
			finished moving has taken another
			and make that piece move to the graveyard  
		*/
	}
}
module.exports = {GameState}
