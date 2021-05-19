const express  = require("express");
const http     = require("http");
const socketio = require("socket.io");
const gs       = require("./game/GameState.js");

const app    = express();
const server = http.createServer(app);
const io     = socketio(server);

const PORT = 3000 || process.env.PORT;

var gamestate = new gs.GameState();

app.use(express.static("public")); /* this line tells Express to use the public folder as our static folder from which we can serve static files*/


server.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
})

var clients = [];
var rooms   = new Map(); 
// socket.io listeners
function socketOnCodeInput(socket,code) {
	socket.join(code);
	if(!rooms.has(code)){
		rooms.set(code,new gs.GameState());
	}
	// update socket's rooms
	if (socket.rooms) {
	    socket.rooms.push(code);
	    //io.sockets.adapter.rooms.get(roomName).size // note - get number of clients in a room
	} else {
	    socket.rooms = [code];
	}
}
io.on("connection",(socket) => {
	
	console.log("new web socket connected "+socket.id);
	socket.on("loading_ready",()=>{
		console.log("ready");
		clients.push(socket);
		if(clients.length == 2){
			console.log("game starting");
		}
		socket.on('disconnect', function() {
			console.log('socket disconnected '+socket.id);

			var i = clients.indexOf(socket);
			clients.splice(i, 1);
			for (var i = 0; i < socket.rooms.length; i++) {
				let room = socket.rooms[i];
				rooms.delete(rooms);
			}
	    });
	});
	socket.on('code_input', (code) => {
    	codeInput(socket,code);
    });
    socket.on('move_input', (move)=>{
    	if(socket.rooms.length > 0){
    		let gamestate = rooms.get(socket.rooms[0]);
    		gamestate.tryMove(move);
    	}
    });
	/*
		this ready callback event causes the client to check if it has finished 
		loading and if so, emit the ready event back to the server. I've done this 
		because if you restart the server while a client that has finished loading 
		is still open in the browser the "connection" event will be fired again from the 
		client but without this connection callback the ready event would 
		have never been called for it.

		ie keeps clients array up to date even if the server is reloaded
		due to code being changed  
	*/
	socket.emit("connection callback"); 
});