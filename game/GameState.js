const defs = require("./defs.js");

class MovingPiece{
	constructor(movetime,name, piece, game, player, moves=null){
		// current time value
		this.timer          = 0;        
		/* 
			total time before timer gets deleted and piece 
			finishes its move, or moves onto the next move if it is a 
			sliding piece
		*/
		this.movetime       = movetime; 
		// name of piece that's moving
		this.name           = name;   
		// reference to game  
		this.game           = game;
		// array of moves, if the piece is a sliding piece
		this.moves          = moves;
		// reference to piece in this.game.state
		this.state_piece    = piece;
		/*
			sliding pieces move in 1 square increments,
			checking for a take of an enemy piece or a block 
			by a piece of the same colour as they go. 
		*/
		this.isSlidingPiece = false;
		// points to next square to move to in this.moves
		this.moveptr        = 0;
		// which player is moving the piece
		this.player         = player;
		if(this.moves){
			this.isSlidingPiece = true;
			this.incrementMovePtr();
			this.movetime /= this.moves.length-1;

		}

	}
	incrementMovePtr(){
		
		this.moveptr++;
		if(this.moveptr >= this.moves.length){
			return true;
		}
		let piece = this.game.getPieceAtSquare(this.moves[this.moveptr]);
		if(piece){
			// stop moving if one of your own pieces moves into your path
			if(this.game.returnPlayerOfPieceType(this.game.getPieceType(piece)) == this.player){
				return true;
			}
		}
		this.state_piece.square_moving_to = this.moves[this.moveptr];
		this.timer = 0;
		return false;
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
		this.timer         += delta;
		this.state_piece.t = this.timer / this.movetime;

		if(this.timer >= this.movetime){
			if(this.finishMove(this.state_piece)){
				return true;
			}
			return this.incrementMovePtr();
		}
		return false;
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
		let taken                      = this.game.checkTake(state_piece);
		state_piece.square_moving_from = {col : to.col, row : to.row};
		state_piece.square_moving_to   = null;
		state_piece.t                  = 0;
		return taken;
	}
}
class GameState{

	constructor(){
		this.winner        = defs.NONE;
		this.state         = JSON.parse(JSON.stringify(defs.initial_state)); // "deep copy" of initial_state
		this.moving_pieces = [];
		this.speed         = 300; // 1 square takes 300 ms
	}
	/*           BOARD DIAGRAM

		       8 black - player2
		       7       N
			   6       |
		       5  W -- X -- E 
		rows   4       |
			   3       S 
			   2
			   1 white - player1
				a b c d e f g h

				      cols

	*/
	// get the coords of a squares cardinal neighbour - clamped
	getN(square){
		if(square == null)
			return null;
		if(square.row + 1 <= 8){
			return {col : square.col, row : square.row + 1};
		}
		else{
			return null;
		}
	}
	getS(square){
		if(square == null)
			return null;
		if(square.row - 1 >= 1){
			return {col : square.col, row : square.row - 1};
		}
		else{
			return null;
		}
	}
	getW(square){
		if(square == null)
			return null;
		let keyindex = defs.cols[square.col];
		if(keyindex - 1 >= 0){
			return { col : defs.alphabet[keyindex-1], row : square.row};
		}
		else{
			return null;
		}
	}
	getE(square){
		if(square == null)
			return null;
		let keyindex = defs.cols[square.col];
		if(keyindex + 1 < 8){
			return { col : defs.alphabet[keyindex+1], row : square.row};
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
		//will check a slide for blocks until it finds the square 
		// the player is trying to move to. if it doesn't find this square returns null

		// move = the move being attempted
		// dir = the function to generate the slide
		// ie this.getE, this.getSE ect.
		this.getDir = dir;
		let moves;
		let n;
		moves  = [];
		moves.push(move[0]);
		n     = this.getDir(move[0]);
		while(n != null){
			moves.push(n);
			if(n.col == move[1].col && n.row == move[1].row){
				return moves;
			}
			if(this.getPieceAtSquare(n)){
				break;
			}
			n = this.getDir(n);
		}
		return null;

	}
	// if these checkXXXXMove functions are called it means the player has at least
	// tried to move the right colour piece
	checkRookMove   (move,piece,player){
		// this first if statement checks to see if the move lands on a piece of the same colour
		if(this.returnPlayerOfPieceType(this.getPieceType(this.getPieceAtSquare(move[1]))) == player){
			return null;
		}
		let moves;
		moves = this.checkSlide(move,this.getN);
		if(moves != null) return moves;
		moves = this.checkSlide(move,this.getS);
		if(moves != null) return moves;
		moves = this.checkSlide(move,this.getE);
		if(moves != null) return moves;
		moves = this.checkSlide(move,this.getW);
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
		moves = this.checkSlide(move,this.getNE);
		if(moves != null) return moves;
		moves = this.checkSlide(move,this.getSE);
		if(moves != null) return moves;
		moves = this.checkSlide(move,this.getNW);
		if(moves != null) return moves;
		moves = this.checkSlide(move,this.getSW);
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
				//console.log("one of your pieces is blocking the way");
				valid = false;
			}
		}
		return valid;
	}
	checkPawnMove  (move,piece,player){
		// to do - refactor. function... not... good...
		let valid = false;
		let middle;
		let getDirec;
		this.getDiag1 = null;
		this.getDiag2 = null;
		let startrow;
		switch(player){
			case defs.PLAYER1:
				getDirec = this.getN;
				this.getDiag1 = this.getNW
				this.getDiag2 = this.getNE
				startrow = 2;
				break;
			case defs.PLAYER2:
				getDirec = this.getS;
				this.getDiag1 = this.getSW
				this.getDiag2 = this.getSE
				startrow = 7;
				break;
			default:
				//console.log("error checkPawnMove - invalid player passed");
		}
		
		// check diag1
		let diag_square = this.getDiag1(move[0]);
		//console.log(diag_square);
		let diag_piece  = this.getPieceAtSquare(diag_square);
		if(diag_piece != null){
			//console.log("diag piece ", piece);
			let diag_player = this.returnPlayerOfPieceType(this.getPieceType(diag_piece));
			//console.log("diag player ",diag_player);
			if(diag_player != player){
				if(move[1].col == diag_square.col && move[1].row == diag_square.row){
					valid = true;
					return valid;
				}
			}
		}
		// check diag 2
		diag_square = this.getDiag2(move[0]);
		diag_piece  = this.getPieceAtSquare(diag_square);
		if(diag_piece != null){
			//console.log("diag piece ", piece);
			let diag_player = this.returnPlayerOfPieceType(this.getPieceType(diag_piece));
			//console.log("diag player ",diag_player);
			if(diag_player != player){
				if(move[1].col == diag_square.col && move[1].row == diag_square.row){
					valid = true;
					return valid;
				}
			}
		}
		// check single square move
		let south = getDirec(move[0]);
		if(move[1].col == south.col && move[1].row == south.row){
			valid = true;
		}
		//check moves when the pieces are moving from their start square
		if(move[0].row == startrow){
			middle = this.getPieceAtSquare(south);
			if(middle != null){
				//if(this.returnPlayerOfPieceType(this.getPieceType(middle)) == player){
				valid = false;
				//}
				return valid;
			}
			south = getDirec(getDirec(move[0]));
			if(move[1].col == south.col && move[1].row == south.row){
				valid = true;
			}
			//console.log("first move, pawn can move 2 squares");
		}
		if(!valid){
			return valid;  // move is already not valid - no point in further checks
		}
		let piece_at_destination = this.getPieceAtSquare(move[1]);
		if(piece_at_destination == null){
			return valid;
		}
		else{
			/*
			let piecetype = this.getPieceType(piece_at_destination);
			if(player == this.returnPlayerOfPieceType(piecetype)){
				//console.log("one of your pieces is blocking the way");
				valid = false;
			}
			*/
			valid = false;
		}
		return valid;
	}
	returnPlayerOfPieceType(piecetype){
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
	getPieceType(piece){
		// returns the unicode symbol for the piece 
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
		//console.log("room "+roomname+" player: "+playername+" tried move: ",move);

		for(let i=0; i<this.state.pieces.length; i++){
			let piece = this.state.pieces[i];
			// if the piece is the one that's been chosen to move
			if(piece.square_moving_to       == null        && 
			    piece.square_moving_from.col == move[0].col &&
			    piece.square_moving_from.row == move[0].row){
			    /* check whether the player is trying to move the right colour of piece here */
			    let moveallowed = true;
			    let piecetype = this.getPieceType(piece);
			    
			    if(this.returnPlayerOfPieceType(piecetype) != player){
			    	//console.log(piecetype);
			     	//console.log("tried to move the opponents piece");
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
							this,
							player,
							moves
						)
				);

				//console.log("move successful");
				break;
			}
			if(i == this.state.pieces.length-1){
				//console.log("no piece selected");
			}
		}
		//console.log("\n");
		
	}
	update(roomname,io,delta){
		if(this.winner != defs.NONE){
			io.to(roomname).emit("winner", this.winner);
			this.winner = defs.NONE
		}
		if(this.moving_pieces.length == 0){
			return;
		}
		let moving_pieces_todelete = [];
		// update all moving pieces - these will change this.state
		for (var i = 0; i < this.moving_pieces.length; i++) {
			let piece       =  this.moving_pieces[i];
			if(piece.update(delta)){
				moving_pieces_todelete.push(i);
			}

		}
		// delete any that have finished
		for (var i = 0; i < moving_pieces_todelete.length; i++) {
			this.moving_pieces.splice(moving_pieces_todelete[i],1);
		}
		// emit new state to clients
		io.to(roomname).emit("update",this.state);
	}

	checkTake(piece_finished){
		/* 
			checks if the peice that's 
			finished moving has taken another
			and make that piece move to the graveyard  
		*/
		let piece = this.getPieceAtSquare(piece_finished.square_moving_to);
		if(piece != null){
			// detect win (king taken)
			let type        = this.getPieceType(piece); 
			let takenPlayer = this.returnPlayerOfPieceType(type);
			if(takenPlayer == defs.PLAYER1 && (type == "♔" || type == "♚")){
				this.winner = defs.PLAYER2;
			}
			else if(takenPlayer == defs.PLAYER2 && (type == "♔" || type == "♚")){
				this.winner = defs.PLAYER1;
			}
			// send piece moving off screen with "in_play == false"
			piece.square_moving_to = {row : 20, col : 'a'};
			piece.in_play = false;
			this.moving_pieces.push(
				new MovingPiece(
					1000,
					piece.name,
					piece,
					this,
					null
				)
			);
			// true == yes, a piece has been taken
			return true;
		}
		// a piece hasn't been taken
		return false;
	}
}
module.exports = {GameState}
