

const express  = require("express");
const https    = require("https");
const socketio = require("socket.io");
const gs       = require("./game/GameState.js");
const defs     = require("./game/defs.js");
const roomgen  = require("./utils/room_name_generator.js");
const namegen  = require("./utils/player_name_generator.js");
const cli      = require("./utils/cli.js");
const fs       = require("fs");
const app      = express();
const server   = https.createServer({
    key: fs.readFileSync('ssl/server.txt'),
    cert: fs.readFileSync('ssl/server.crt'),
},app);
const io       = socketio(server);
const PORT     = 443 || process.env.PORT;


var verbose_rooms = false;
const geval = eval;             // create a global copy of eval - can now be used to 
								// create global functions  / variables from the 
								// command line REPL using the command js

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (text) {
	doCommand(text);
});
app.use(express.static("public")); /* this line tells Express to use the public folder as our static folder from which we can serve static files*/


server.listen(PORT, () => {
	console.log(`Server listening at http://localhost:${PORT}                                                  `);
	cli.printTitle();
	namegen.init();
});

var clients      = new Map();
var rooms        = new Map(); 
var public_rooms = [];
var banned_ips   = [];
function removeFromPublicRooms(socket){
	for(let i = 0; i<public_rooms.length; i++){
		if(public_rooms[i].code == socket.data.room){
			public_rooms.splice(i,1);
			break;
		}
	}
	socket.broadcast.emit("joinable_change",public_rooms);
}
function addToPublicRooms(socket){
	public_rooms.push({name : socket.data.name, code : socket.data.room});
	socket.broadcast.emit("joinable_change",public_rooms);
}
// socket.io listeners
function socketOnCodeInput(socket,code) {
	// user has submitted a code to try and join a room
	if(verbose_rooms){cli.printTopDivider();}
	if(verbose_rooms){cli.logCyanText("socket "+socket.id+" tried to join room "+code);}
	if(rooms.has(code)){
		let size = io.sockets.adapter.rooms.get(code).size;
		if(size == 1){
			// successful join

			socket.join(code);
			rooms.delete(socket.data.room);
			socket.data.room = code;
			socket.emit("make_player_2");
			let clients_in_room = Array.from(io.sockets.adapter.rooms.get(code));

			//console.log(clients.get(id).data.name);
			let socket0 = clients.get(clients_in_room[0]);
			let socket1 = clients.get(clients_in_room[1]);
			let name0 = socket0.data.name;
			let name1 = socket1.data.name;
			removeFromPublicRooms(socket0);
			removeFromPublicRooms(socket1);
			io.to(clients_in_room[0]).emit("successful_join", name1);
			io.to(clients_in_room[1]).emit("successful_join", name0);
			if(verbose_rooms){console.log("successful join");}
			if(verbose_rooms){console.log(rooms);}
		}
		else if(size > 1){
			if(verbose_rooms){console.log("room full");}
			socket.emit("room_full");
		}
	}
	else{
		if(verbose_rooms){console.log("invalid code");}
		socket.emit("invalid_room_code");
	}
	if(verbose_rooms){cli.printBottomDivider();}
}
io.on("connection", (socket) => {
	
	if(banned_ips.includes(socket.handshake.address)){
		return;
	}
	socket.on("loading_ready",()=>{
		// client has finished loading assets
		// store socket
		clients.set(socket.id,socket);
		
		// generate a random room name of 6 chars
	    let room_code = roomgen.getRoomName(6);
	    while(rooms.has(room_code)){
	    	room_code = roomgen.getRoomName(7);
	    }

	    // generate player name
	    let player_name = namegen.getPlayerName(2," ");

	    // join that room
	    socket.join(room_code);

	    // add room code and a new GameState to the map of rooms
		rooms.set(room_code,new gs.GameState());
		

		// store the room code and name in the socket
		socket.data.room = room_code;
		socket.data.name = player_name;

		// tell client what the room code is so it can display it
		socket.emit("set_room", room_code, player_name);

		// show client which rooms can be joined
		socket.emit("joinable_change",public_rooms);

		// set handler for user trying to submit a code to join a room
		socket.on('code_input', (code) => {
	    	socketOnCodeInput(socket,code);

	    });
		// client changes their name
		socket.on('name_change',(name) => {
			socket.data.name = name;
			if(verbose_rooms){
				cli.printTopDivider();
				console.log("socket "+socket.id+" changed name to "+ name);
				cli.printBottomDivider();
			}
			for(let i=0; i<public_rooms.length; i++){
				if(public_rooms[i].code == socket.data.room){
					public_rooms[i].name = socket.data.name;
					//console.log("namechange");
					socket.broadcast.emit("joinable_change",public_rooms);
					break;
				}
			}
			
		});
		// joinable status changed
		socket.on('client_joinable_status_change',(status)=>{
			if(status == true){
				addToPublicRooms(socket);
				//public_rooms.push({name : socket.data.name, code : socket.data.room})
			}
			else if(status == false){
				removeFromPublicRooms(socket);
			}
			
		});
	    // set handler for player trying to move a piece
	    socket.on('move_input', (move, player)=>{
	    	let roomname  = socket.data.room;
		    let gamestate = rooms.get(roomname);
		    gamestate.tryMove(roomname, move, player);
		});

		// set handler for player disconnecting
		socket.on('disconnect', function() {
			clients.delete(socket.id);
			let room = socket.data.room;
			io.to(room).emit("opponent_disconnected");
			rooms.delete(room);
			removeFromPublicRooms(socket);
			if(verbose_rooms){
				cli.printTopDivider();
				cli.logCyanText('socket disconnected '+socket.id);
				console.log(room);
				console.log(rooms);
				cli.printBottomDivider();
			}

	    });
		if(verbose_rooms){
			cli.printTopDivider();
			cli.logCyanText("new web socket connected "+socket.id+" length of clients: "+clients.size);
			console.log(rooms);
			cli.printBottomDivider();
		}
	});
});

let last = new Date().getTime();
let interval = setInterval(()=>{
	masterUpdateLoop();
},(1/defs.FPS)*1000);

function masterUpdateLoop() {
	// calculate delta time
	let now = new Date().getTime();
	let delta = now - last;
	last = now;
	//update rooms
	rooms.forEach((gamestate, roomname)=>{
		gamestate.update(roomname,io,delta);
	});
}
function banSocket(socket_id) {
	banned_ips.push(clients.get(socket_id.trim()).handshake.address);
}

function restartUpdateLoop() {
	//console.log("restarting room update loop - all players will lose connection");
	clearInterval(interval);
	interval = setInterval(()=>{
		masterUpdateLoop();
	},(1/defs.FPS)*1000);
}
function doCommand(text) {
	cli.printTopDivider();
	text = text.trim();
	switch(text){
		case "banlist":
			console.log(banned_ips);
			break;
		case "cls":
			console.clear();
			cli.printTitle();
			return;
		case "clients":
			console.log(clients);
			break;
		case "rooms":
			console.log(rooms);
			break;
		case "fps":
			console.log(defs.FPS);
			break;
		case "verboserooms":
			if(!verbose_rooms){
				verbose_rooms = true;
				console.log("verbose rooms on");
			}
			else{
				verbose_rooms = false;
				console.log("verbose rooms off");
			}
			break;
		default:
			if(/setfps\s+/.test(text)){
				let matches;
				if(/\s+\d+.\d+/.test(text)){
					// decimal
					let matches = text.match(/\s+\d+.\d+/);
					if(matches.length > 1){
						console.log("command takes 1 argument");

					}
					else if(matches.length == 1){
						console.log("setting fps to "+matches[0]);
						defs.FPS = Number.parseFloat(matches[0]);
						restartUpdateLoop();
					}
				}
				else if(/\s+\d+/.test(text)){
					//integer
					let matches = text.match(/\s+\d+/);
					if(matches.length > 1){
						console.log("command takes 1 argument");
					}
					else if(matches.length == 1){
						console.log("setting fps to "+matches[0]);
						defs.FPS = Number.parseInt(matches[0]);
						restartUpdateLoop();
					}
				}
			}
			else if(/watch\s+/.test(text)){
				let matches = [...text.match(/\w+/g)];
				//console.log(matches);
				if(matches.length > 2){
					console.log("command takes 1 argument - name of room");
				}
				else if(matches.length == 2){
					//console.log(matches[1]);
					let param = matches[1];
					if(!rooms.has(param)){
						console.log("no room: "+param);
					}
					else{
						if(!rooms.get(param).watched){
							console.log("room: "+param+" being watched");
							rooms.get(param).watched = true;
						}
						else{
							console.log("room: "+param+" stopped being watched");
							rooms.get(param).watched = false;
						}
						
					}
				}
			}
			else if(/state\s+/.test(text)){
				let matches = [...text.match(/\w+/g)];
				//console.log(matches);
				if(matches.length > 2){
					console.log("command takes 1 argument - name of room");
				}
				else if(matches.length == 2){
					//console.log(matches[1]);
					let param = matches[1];
					if(!rooms.has(param)){
						console.log("no room: "+param);
					}
					else{
						console.log(rooms.get(param).state);
						
					}
				}
			}
			else if(/ban\s+/.test(text)){
				let matches = [...text.match(/\w+/g)];
				//console.log(matches);
				if(matches.length > 2){
					console.log("command takes 1 argument - name of room");
				}
				else if(matches.length == 2){
					//console.log(matches[1]);
					let param = matches[1];
					if(!clients.has(param)){
						console.log("no room: "+param);
					}
					else{
						if(clients.has(matches[1].trim())){
							banSocket(matches[1]);
							console.log("ip address "+clients.get(matches[1].trim()).handshake.address+" has been banned");
						}
						else{
							console.log("you entered an invalid socket id");
						}
					}
				}
			}
			else if(/^js\s+/.test(text)){
				try{
					console.log(eval(text.substr(2)));
				}
				catch(e){
					console.log(e.message);
				}
				
			}
			else{
				console.log("invalid command");
			}
			break;
	}

	cli.printBottomDivider();
}