function getRoomName(length){
	let characters = [
	"a","b","c","d","e","f","g","h",
	"i","j","k","l","m","n","o","p",
	"q","r","s","t","u","v","w","x",
	"y","z"
	//,"0","1","2","3","4","5",
	//"6","7","8","9"
	];
	let name = "";
	for(let i=0; i<length; i++){
		name += characters[Math.floor(Math.random() * characters.length)];
	}
	return name;
}
module.exports = {getRoomName}