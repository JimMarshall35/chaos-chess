const express  = require("express");
const http     = require("http");
const socketio = require("socket.io");
const gs       = require("./game/GameState.js");
const defs     = require("./game/defs.js");
const roomgen  = require("./utils/room_name_generator.js");

const app      = express();
const server   = http.createServer(app);
const io       = socketio(server);
const PORT     = 80 || process.env.PORT;


app.use(express.static("public")); /* this line tells Express to use the public folder as our static folder from which we can serve static files*/


server.listen(PORT, () => {
	console.log(`Example app listening at http://localhost:${PORT}`);
	console.log();
	console.log();
	console.log("██████╗░████████╗░██████╗  ░█████╗░██╗░░██╗███████╗░██████╗░██████╗");
	console.log("██╔══██╗╚══██╔══╝██╔════╝  ██╔══██╗██║░░██║██╔════╝██╔════╝██╔════╝");
	console.log("██████╔╝░░░██║░░░╚█████╗░  ██║░░╚═╝███████║█████╗░░╚█████╗░╚█████╗░");
	console.log("██╔══██╗░░░██║░░░░╚═══██╗  ██║░░██╗██╔══██║██╔══╝░░░╚═══██╗░╚═══██╗");
	console.log("██║░░██║░░░██║░░░██████╔╝  ╚█████╔╝██║░░██║███████╗██████╔╝██████╔╝");
	console.log("╚═╝░░╚═╝░░░╚═╝░░░╚═════╝░  ░╚════╝░╚═╝░░╚═╝╚══════╝╚═════╝░╚═════╝░");
	console.log(String.raw`                                                     _:_`);
	console.log(String.raw`                                                    '-.-'`);
	console.log(String.raw`                                           ()      __.'.__`);
	console.log(String.raw`                                        .-:--:-.  |_______|`);
	console.log(String.raw`                                 ()      \____/    \=====/`);
	console.log(String.raw`                                 /\      {====}     )___(`);
	console.log(String.raw`                      (\=,      //\\      )__(     /_____\\`);
	console.log(String.raw`      __    |'-'-'|  //  .\    (    )    /____\     |   |`);
	console.log(String.raw`     /  \   |_____| (( \_  \    )__(      |  |      |   |`);
	console.log(String.raw`     \__/    |===|   ))   \_)  /____\     |  |      |   |`);
	console.log(String.raw`    /____\   |   |  (/     \    |  |      |  |      |   |`);
	console.log(String.raw`     |  |    |   |   | _.-'|    |  |      |  |      |   |`);
	console.log(String.raw`     |__|    )___(    )___(    /____\    /____\    /_____\\`);
	console.log(String.raw`    (====)  (=====)  (=====)  (======)  (======)  (=======)`);
	console.log(String.raw`    }===={  }====={  }====={  }======{  }======{  }======={`);
	console.log(String.raw`   (______)(_______)(_______)(________)(________)(_________)`);
	console.log();
	console.log("Jim Marshall - 2021");
	console.log();
	console.log();
	printBottomDivider();
});

var clients = [];
var rooms   = new Map(); 
// socket.io listeners
function socketOnCodeInput(socket,code) {
	// user has submitted a code to try and join a room
	printTopDivider();
	logCyanText("socket "+socket.id+" tried to join room "+code);
	if(rooms.has(code)){
		let size = io.sockets.adapter.rooms.get(code).size;
		if(size == 1){
			// successful join

			socket.join(code);
			rooms.delete(socket.data.room);
			socket.data.room = code;
			socket.emit("make_player_2");
			io.to(code).emit("successful_join");
			console.log("successful join");
			console.log(rooms);
		}
		else if(size > 1){
			console.log("room full");
			socket.emit("room_full");
		}
	}
	else{
		console.log("invalid code");
		socket.emit("invalid_room_code");
	}
	printBottomDivider();
}
io.on("connection", (socket) => {
	
	
	socket.on("loading_ready",()=>{
		// client has finished loading assets

		// store socket
		clients.push(socket);
		printTopDivider();
		logCyanText("new web socket connected "+socket.id+" length of clients: "+clients.length);
		
		// generate a random room name of 6 chars
	    let room_code = roomgen.getRoomName(6);
	    while(rooms.has(room_code)){
	    	room_code = roomgen.getRoomName(6);
	    }

	    // join that room
	    socket.join(room_code);

	    // add room code and a new GameState to the map of rooms
		rooms.set(room_code,new gs.GameState());
		console.log(rooms);

		// store the room code in the socket
		socket.data.room = room_code;

		// tell client what the room code is so it can display it
		socket.emit("set_room", room_code);

		// set handler for user trying to submit a code to join a room
		socket.on('code_input', (code) => {
	    	socketOnCodeInput(socket,code);

	    });

	    // set handler for player trying to move a piece
	    socket.on('move_input', (move, player)=>{
	    	let roomname  = socket.data.room;
		    let gamestate = rooms.get(roomname);
		    gamestate.tryMove(roomname, move, player);
		});

		// set handler for player disconnecting
		socket.on('disconnect', function() {
			printTopDivider();
			logCyanText('socket disconnected '+socket.id);

			let i = clients.indexOf(socket);
			clients.splice(i, 1);
			let room = socket.data.room;
			console.log(room);
			io.to(room).emit("opponent_disconnected");
			rooms.delete(room);
			console.log(rooms);

			printBottomDivider();

	    });

	    printBottomDivider();
	});
});

let last = new Date().getTime();
setInterval(()=>{
	// calculate delta time
	let now = new Date().getTime();
	let delta = now - last;
	last = now;
	//update rooms
	rooms.forEach((gamestate, roomname)=>{
		gamestate.update(roomname,io,delta);
	});
},(1/defs.FPS)*1000);

function printTopDivider() {
	console.log("--------------------------------------------------------------------------------------------------------------");
	let date_ob = new Date();
	// current date
	// adjust 0 before single digit date
	let date = ("0" + date_ob.getDate()).slice(-2);

	// current month
	let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

	// current year
	let year = date_ob.getFullYear();

	// current hours
	let hours = date_ob.getHours();

	// current minutes
	let minutes = date_ob.getMinutes();

	// current seconds
	let seconds = date_ob.getSeconds();

	// prints date & time in YYYY-MM-DD HH:MM:SS format
	console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

	console.log();
}
function printBottomDivider(){
	console.log();
	console.log("--------------------------------------------------------------------------------------------------------------");
}
function logCyanText(str){
	console.log('\x1b[36m%s\x1b[0m',str);
}