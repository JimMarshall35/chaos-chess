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
// socket.io listeners
io.on("connection",(socket) => {
	
	console.log("new web socket connected");
	socket.on("ready",()=>{
		console.log("ready");
		clients.push(socket);
		if(clients.length == 2){
			console.log("game starting");
		}
		socket.on('disconnect', function() {
	      console.log('Got disconnect!');

	      var i = clients.indexOf(socket);
	      clients.splice(i, 1);
	   });

	});
});