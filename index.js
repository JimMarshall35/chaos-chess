const express  = require("express");
const http     = require("http");
const socketio = require("socket.io");
const gs       = require("./game/GameState.js");
const defs     = require("./game/defs.js");
const roomgen  = require("./utils/room_name_generator.js");

const app      = express();
const server   = http.createServer(app);
const io       = socketio(server);
const PORT     = 3000 || process.env.PORT;


app.use(express.static("public")); /* this line tells Express to use the public folder as our static folder from which we can serve static files*/


server.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

var clients = [];
var rooms   = new Map(); 
// socket.io listeners
function socketOnCodeInput(socket,code) {
	if(rooms.has(code)){
		let size = io.sockets.adapter.rooms.get(code).size;
		if(size == 1){
			// successful join
			for (var i = 0; i < socket.data.rooms.length; i++) {
				let room = socket.data.rooms[i];
				rooms.delete(room);
				console.log(rooms);
			}
			socket.join(code);
			socket.data.rooms = [];//
			socket.data.rooms.push(code);

			io.to(code).emit("successful_join");
		}
		else if(size > 1){
			socket.emit("room_full");
		}
	}
	else{
		socket.emit("invalid_room_code");
	}
}
io.on("connection", (socket) => {
	
	console.log("new web socket connected "+socket.id);
	socket.on("loading_ready",()=>{
		clients.push(socket);
		socket.on('disconnect', function() {
			console.log('socket disconnected '+socket.id);

			var i = clients.indexOf(socket);
			clients.splice(i, 1);
			for (var i = 0; i < socket.data.rooms.length; i++) {
				let room = socket.data.rooms[i];
				io.to(room).emit("opponent_disconnected");
				rooms.delete(room);
				console.log(rooms);
			}
	    });
		
	    let room_code = roomgen.getRoomName(6);
	    socket.join(room_code);
		if(!rooms.has(room_code)){
			rooms.set(room_code,new gs.GameState());
			console.log(rooms);
		}

		socket.data.rooms = [];
		//console.log(socket);
		socket.data.rooms.push(room_code);

		socket.emit("set_room", room_code);
		socket.on('code_input', (code) => {
	    	socketOnCodeInput(socket,code);

	    });
	    socket.on('move_input', (move)=>{
	    	let roomname  = socket.data.rooms[0];
		    let gamestate = rooms.get(roomname);
		    gamestate.tryMove(roomname, move);
		});
	});
});

let last = new Date().getTime();
setInterval(()=>{
	let now = new Date().getTime();
	let delta = now - last;
	last = now;
	rooms.forEach((gamestate, roomname)=>{
		gamestate.update(roomname,io,delta);
	});
},(1/defs.FPS)*1000);