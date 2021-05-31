const defs = require("./defs.js");

class MovingPiece{
	constructor(movetime,name, piece, game, moves=null){
		this.timer          = 0;        // current time value
		this.movetime       = movetime; // total time before timer gets deleted and piece finishes its move
		this.name           = name;     // name of piece that's moving
		this.game           = game;
		this.moves          = moves;
		this.state_piece    = piece;
		if(this.moves){
			this.isSlidingPiece = true;
		}
		else{
			this.isSlidingPiece = false;
		}
	}
	update(delta){
		if(this.isSlidingPiece){
			return this.updateSliding(delta);
		}
		else{
			return this.updateNonSliding(delta);
		}
	}
	updateSliding(delta){
		return true;
	}
	updateNonSliding(delta){
		let pieces         = this.game.state.pieces;
		this.timer         += delta;
		this.state_piece.t = this.timer / this.movetime;

		if(this.timer >= this.movetime){
			this.finishMove(this.state_piece);
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
	/* 

       8
       7       N
	   6       |
       5  W -- X -- E 
       4       |
	   3       S 
	   2
	   1
		a b c d e f g h

	*/
	// get the coords of a squares cardinal neighbour - clamped
	getN(square){
		if(square == null)
			return null;
		if(square.row + 1 <= 8){
			return {col : square.col, row : square.row + 1, type : 0};
		}
		else{
			return null;
		}
	}
	getS(square){
		if(square == null)
			return null;
		if(square.row - 1 >= 1){
			return {col : square.col, row : square.row - 1, type : 0};
		}
		else{
			return null;
		}
	}
	getW(square){
		if(square == null)
			return null;
		let keyindex = defs.cols[square.col];
		if(keyindex - 1 > 0){
			return { col : defs.alphabet[keyindex-1], row : square.row, type : 0};
		}
		else{
			return null;
		}
	}
	getE(square){
		if(square == null)
			return null;
		let keyindex = defs.cols[square.col];
		if(keyindex + 1 <= 8){
			return { col : defs.alphabet[keyindex+1], row : square.row, type : 0};
		}
		else{
			return null;
		}
	}
	// get square coords of diagonals
	getNE(square){
		return this.getE(this.getN(square));
	}
	getSE(square){
		return this.getE(this.getS(square));
	}
	getSW(square){
		return this.getW(this.getS(square));
	}
	getNW(square){
		return this.getW(this.getN(square));
	}
	getPieceAtSquare(square){
		if(square == null){
			return null;
		}
		for(let i=0; i<this.state.pieces.length; i++){
			let piece = this.state.pieces[i];
			if(!piece.in_play){
				continue;
			}
			if(piece.square_moving_to != null){
				continue;
			}
			if(piece.square_moving_from.col == square.col && 
				piece.square_moving_from.row == square.row){
				return this.state.pieces[i];
			}
		}
		return null;
	}
	checkSlide(move,dir){
		let getDir;
		let moves;
		let n;
		switch(dir){
			case defs.DIRECTIONS.N:
				moves  = [];
				moves.push(move[0]);
				n     = this.getN(move[0]);
				while(n != null){
					moves.push(n);
					if(n.col == move[1].col && n.row == move[1].row){
						return moves;
					}
					if(this.getPieceAtSquare(n)){
						break;
					}
					n = this.getN(n);
				}
				break;
			case defs.DIRECTIONS.S:	
				moves  = [];
				moves.push(move[0]);
				n     = this.getS(move[0]);
				while(n != null){
					moves.push(n);
					if(n.col == move[1].col && n.row == move[1].row){
						return moves;
					}
					if(this.getPieceAtSquare(n)){
						break;
					}
					n = this.getS(n);
				}
				break;		
			case defs.DIRECTIONS.E:
				moves  = [];
				moves.push(move[0]);
				n     = this.getE(move[0]);
				while(n != null){
					moves.push(n);
					if(n.col == move[1].col && n.row == move[1].row){
						return moves;
					}
					if(this.getPieceAtSquare(n)){
						break;
					}
					n = this.getE(n);
				}
				break;
			case defs.DIRECTIONS.W:
				moves  = [];
				moves.push(move[0]);
				n     = this.getW(move[0]);
				while(n != null){
					moves.push(n);
					if(n.col == move[1].col && n.row == move[1].row){
						return moves;
					}
					if(this.getPieceAtSquare(n)){
						break;
					}
					n = this.getW(n);
				}
				break;
			case defs.DIRECTIONS.NE:
				moves  = [];
				moves.push(move[0]);
				n     = this.getNE(move[0]);
				while(n != null){
					moves.push(n);
					if(n.col == move[1].col && n.row == move[1].row){
						return moves;
					}
					if(this.getPieceAtSquare(n)){
						break;
					}
					n = this.getNE(n);
				}
				break;
			case defs.DIRECTIONS.SE:
				moves  = [];
				moves.push(move[0]);
				n     = this.getSE(move[0]);
				while(n != null){
					moves.push(n);
					if(n.col == move[1].col && n.row == move[1].row){
						return moves;
					}
					if(this.getPieceAtSquare(n)){
						break;
					}
					n = this.getSE(n);
				}
				break;
			case defs.DIRECTIONS.SW:
				moves  = [];
				moves.push(move[0]);
				n     = this.getSW(move[0]);
				while(n != null){
					moves.push(n);
					if(n.col == move[1].col && n.row == move[1].row){
						return moves;
					}
					if(this.getPieceAtSquare(n)){
						break;
					}
					n = this.getSW(n);
				}
				break;
			case defs.DIRECTIONS.NW:
				moves  = [];
				moves.push(move[0]);
				n     = this.getNW(move[0]);
				while(n != null){
					moves.push(n);
					if(n.col == move[1].col && n.row == move[1].row){
						return moves;
					}
					if(this.getPieceAtSquare(n)){
						break;
					}
					n = this.getNW(n);
				}
				break;
		}
		
		return null;

	}
	// if these checkXXXXMove functions are called it means the player has at least
	// tried to move the right colour piece
	checkRookMove   (move,piece,player){
		if(this.returnPlayerOfPieceType(this.getPieceType(this.getPieceAtSquare(move[1]))) == player){
			return null;
		}
		let moves;
		moves = this.checkSlide(move,defs.DIRECTIONS.N);
		if(moves != null) return moves;
		moves = this.checkSlide(move,defs.DIRECTIONS.S);
		if(moves != null) return moves;
		moves = this.checkSlide(move,defs.DIRECTIONS.E);
		if(moves != null) return moves;
		moves = this.checkSlide(move,defs.DIRECTIONS.W);
		if(moves != null) return moves;

		return null;
	}
	checkKnightMove (move,piece,player){
		if(this.returnPlayerOfPieceType(this.getPieceType(this.getPieceAtSquare(move[1]))) == player){
			return null;
		}
		let col0  = defs.cols[move[0].col];
		let col1  = defs.cols[move[1].col];
		let row0  = move[0].row - 1;
		let row1  = move[1].row - 1;
		let valid = false;
		if(col0 + 2 == col1 || col0 -2 == col1){
			if(row0 +1 == row1 || row0 -1 == row1){
				return true;
			}
		}
		if(col0 + 1 == col1 || col0 -1 == col1){
			if(row0 +2 == row1 || row0 -2 == row1){
				return true;
			}
		}
		return null;
	}
	checkBishopMove (move,piece,player){
		if(this.returnPlayerOfPieceType(this.getPieceType(this.getPieceAtSquare(move[1]))) == player){
			return null;
		}
		let moves;
		moves = this.checkSlide(move,defs.DIRECTIONS.NE);
		if(moves != null) return moves;
		moves = this.checkSlide(move,defs.DIRECTIONS.SE);
		if(moves != null) return moves;
		moves = this.checkSlide(move,defs.DIRECTIONS.NW);
		if(moves != null) return moves;
		moves = this.checkSlide(move,defs.DIRECTIONS.SW);
		if(moves != null) return moves;
		return null;
	}
	checkQueenMove  (move,piece,player){
		if(this.returnPlayerOfPieceType(this.getPieceType(this.getPieceAtSquare(move[1]))) == player){
			return null;
		}
		let moves;
		moves = this.checkBishopMove(move,piece,player);
		if(moves != null) return moves;
		moves = this.checkRookMove(move,piece,player);
		if(moves != null) return moves;
		return null;
	}
	checkKingMove   (move,piece,player){
		let col0  = defs.cols[move[0].col];
		let col1  = defs.cols[move[1].col];
		let row0  = move[0].row - 1;
		let row1  = move[1].row - 1;
		let valid = false;
		if(row0 == row1){
			if(col1 == col0 + 1 || col1 == col0-1){         // adjacent col
				valid = true;
			}
		}
		else if(col0 == col1){
			if(row1 == row0 +1 || row1 == row0 -1){         // adjacent row
				valid = true;
			}
		}
		else if((row1 == row0 + 1 || row1 == row0 -1) &&    // adjacent diagonal
			    (col1 == col0 + 1 || col1 == col0 -1)){
			valid = true;
			
		}
		if(!valid){
			return valid;  // move is already not valid - no point in further checks
		}
		let piece_at_destination = this.getPieceAtSquare(move[1]);
		if(piece_at_destination == null){
			return valid;
		}
		else{
			let piecetype = this.getPieceType(piece_at_destination);
			if(player == this.returnPlayerOfPieceType(piecetype)){
				console.log("one of your pieces is blocking the way");
				valid = false;
			}
		}
		return valid;
	}
	checkPawnMove  (move,piece,player){
		let valid = false;

		switch(player){
			case defs.PLAYER1:
				console.log(move[1]);
				let north = this.getN(move[0]);
				console.log(north);
				if(move[1].col == north.col && move[1].row == north.row){
					valid = true;
				}
				if(move[0].row == 2){
					north = this.getN(this.getN(move[0]));
					if(move[1].col == north.col && move[1].row == north.row){
						valid = true;
					}
					console.log("first move, pawn can move 2 squares");
				}
				break;
			case defs.PLAYER2:
				let south = this.getS(move[0]);
				if(move[1].col == south.col && move[1].row == south.row){
					valid = true;
				}
				if(move[0].row == 7){
					south = this.getS(this.getS(move[0]));
					if(move[1].col == south.col && move[1].row == south.row){
						valid = true;
					}
					console.log("first move, pawn can move 2 squares");
				}
				break;
			default:
				console.log("error checkPawnMove - invalid player passed");
		}
		if(!valid){
			return valid;  // move is already not valid - no point in further checks
		}
		let piece_at_destination = this.getPieceAtSquare(move[1]);
		if(piece_at_destination == null){
			return valid;
		}
		else{
			let piecetype = this.getPieceType(piece_at_destination);
			if(player == this.returnPlayerOfPieceType(piecetype)){
				console.log("one of your pieces is blocking the way");
				valid = false;
			}
		}
		return valid;
	}
	returnPlayerOfPieceType(piecetype){
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
	getPieceType(piece){
		if(piece == null){
			return null;
		}
		if(piece.name.length == 1)
	    	return piece.name;
	    else
	    	return piece.name[1];
	}
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
			    let piecetype = this.getPieceType(piece);
			    
			    if(this.returnPlayerOfPieceType(piecetype) != player){
			    	console.log(piecetype);
			     	console.log("tried to move the opponents piece");
			     	moveallowed = false;
			    }

			    if(!moveallowed){
			    	break;
			    }
				/* check for valid move here, if move invalid, break */
				let moves = null;
				switch(piecetype){
					case "♖":
					case "♜":
					/* 
					the sliding pieces' moves produce an array of moves, each 1 square
					from each other. 
					*/
						moves = this.checkRookMove(move,piece,player);
						if(!moves){
							moveallowed = false;
						}
						break;
					case "♘":
					case "♞":
						if(!this.checkKnightMove(move,piece,player)){
							moveallowed = false;
						}
						break;
					case "♗":
					case "♝":
						moves = this.checkBishopMove(move,piece,player)
						if(!moves){
							moveallowed = false;
						}
						break;
					case "♕":
					case "♛":
						moves = this.checkQueenMove(move,piece,player);
						if(!moves){
							moveallowed = false;
						}
						break;
					case "♔":
					case "♚":
						if(!this.checkKingMove(move,piece,player)){
							moveallowed = false;
						}
						break;
					case "♙":
					case "♟":
						if(!this.checkPawnMove(move,piece,player)){
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
							piece,                 // ref to piece in this.state
							this                   
						)
					);
				if(moves){
					console.log(moves);
				}
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
			if(piece.update(delta)){
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
