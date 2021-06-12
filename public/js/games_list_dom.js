function createGamesListDOM(joinable_players){
	let list_dom = document.getElementById("joinable-games-list");
	list_dom.innerHTML = "";
	for (var i = 0; i < joinable_players.length; i++) {
		let p = joinable_players[i];
		if(p.code == roomcode){
			continue;
		}
		let outer = document.createElement("div");
		outer.classList.add("player-list-row");
		
		let name_h2 = document.createElement("h2");
		name_h2.classList.add("player-list-name");
		name_h2.textContent = p.name;

		let join_button = document.createElement("button");
		join_button.classList.add("game-join-btn");
		join_button.textContent = "Join";
		join_button.onclick = ()=>{
			socket.emit("code_input",p.code);
		};

		
		outer.appendChild(join_button);
		outer.appendChild(name_h2);
		list_dom.appendChild(outer);
	}
}
function joinableCheckboxChange(event){
	console.log(event.target.checked);
	socket.emit("client_joinable_status_change",event.target.checked);
}
function initGamesListDom(){
	document.getElementById("joinable-checkbox").checked = false;
}