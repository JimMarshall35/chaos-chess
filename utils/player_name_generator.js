const fs = require('fs');
function getPlayerName(num,separator) {
	let name = "";
	for(let i=0; i<num; i++){
		let index = Math.floor(Math.random()*words_len);
		name += words[index].trim();
		if(i < num - 1){
			name += separator;
		}
	}
	return name;
}
var words, words_len;
function init() {
	try {
	  words = fs.readFileSync('words.txt', 'utf8').toString().split("\n");
	  words_len = words.length;
	} catch (err) {
	  console.error(err)
	}
}
module.exports = {getPlayerName, init}