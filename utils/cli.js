const colors = require('colors');

function printTitle() {
	printTopDivider();
	console.log(          "                                                                                                                        ".bgBrightWhite);
	console.log(String.raw`                                                                                  _:_                                   `.bold.black.bgBrightWhite);
	console.log(String.raw`                                                                                 '-.-'                                  `.bold.black.bgBrightWhite);
	console.log(String.raw`                                                                        ()      __.'.__                                 `.bold.black.bgBrightWhite);
	console.log(String.raw`                                                                     .-:--:-.  |_______|                                `.bold.black.bgBrightWhite);
	console.log(String.raw`                                                              ()      \____/    \=====/                                 `.bold.black.bgBrightWhite);
	console.log(String.raw`                                                              /\      {====}     )___(                                  `.bold.black.bgBrightWhite);
	console.log(String.raw`                                                   (\=,      //\\      )__(     /_____\                                 `.bold.black.bgBrightWhite);
	console.log(String.raw`                                   __    |'-'-'|  //  .\    (    )    /____\     |   |                                  `.bold.black.bgBrightWhite);
	console.log(String.raw`                                  /  \   |_____| (( \_  \    )__(      |  |      |   |                                  `.bold.black.bgBrightWhite);
	console.log(String.raw`                                  \__/    |===|   ))   \_)  /____\     |  |      |   |                                  `.bold.black.bgBrightWhite);
	console.log(String.raw`                                 /____\   |   |  (/     \    |  |      |  |      |   |                                  `.bold.black.bgBrightWhite);
	console.log(String.raw`                                  |  |    |   |   | _.-'|    |  |      |  |      |   |                                  `.bold.black.bgBrightWhite);
	console.log(String.raw`                                  |__|    )___(    )___(    /____\    /____\    /_____\                                 `.bold.black.bgBrightWhite);
	console.log(String.raw`                                 (====)  (=====)  (=====)  (======)  (======)  (=======)                                `.bold.black.bgBrightWhite);
	console.log(String.raw`                                 }===={  }====={  }====={  }======{  }======{  }======={                                `.bold.black.bgBrightWhite);
	console.log(String.raw`                                (______)(_______)(_______)(________)(________)(_________)                               `.bold.black.bgBrightWhite);
	console.log(          "                                                                                                                        ".brightRed.bgBrightWhite);
	console.log(          "                                                                                                                        ".brightRed.bgBrightWhite);
	console.log(          "                           ██████".brightRed.bgBrightWhite+"╗ ".brightGreen.bgBrightWhite+"████████".brightRed.bgBrightWhite+"╗ ".brightGreen.bgBrightWhite+"██████".brightRed.bgBrightWhite+"╗   ".brightGreen.bgBrightWhite+"█████".brightRed.bgBrightWhite+"╗ ".brightGreen.bgBrightWhite+"██".brightRed.bgBrightWhite+"╗  ".brightGreen.bgBrightWhite+"██".brightRed.bgBrightWhite+"╗".brightGreen.bgBrightWhite+"███████".brightRed.bgBrightWhite+"╗ ".brightGreen.bgBrightWhite+"██████".brightRed.bgBrightWhite+"╗ ".brightGreen.bgBrightWhite+"██████".brightRed.bgBrightWhite+"╗                          ".brightGreen.bgBrightWhite);
	console.log(          "                           ██".brightRed.bgBrightWhite+"╔══".brightGreen.bgBrightWhite+"██".brightRed.bgBrightWhite+"╗╚══".brightGreen.bgBrightWhite+"██".brightRed.bgBrightWhite+"╔══╝".brightGreen.bgBrightWhite+"██".brightRed.bgBrightWhite+"╔════╝  ".brightGreen.bgBrightWhite+"██".brightRed.bgBrightWhite+"╔══".brightGreen.bgBrightWhite+"██".brightRed.bgBrightWhite+"╗".brightGreen.bgBrightWhite+"██".brightRed.bgBrightWhite+"║  ".brightGreen.bgBrightWhite+"██".brightRed.bgBrightWhite+"║".brightGreen.bgBrightWhite+"██".brightRed.bgBrightWhite+"╔════╝".brightGreen.bgBrightWhite+"██".brightRed.bgBrightWhite+"╔════╝".brightGreen.bgBrightWhite+"██".brightRed.bgBrightWhite+"╔════╝                          ".brightGreen.bgBrightWhite);
	console.log(          "                           ██████".brightRed.bgBrightWhite+"╔╝   ".brightGreen.bgBrightWhite+"██".brightRed.bgBrightWhite+"║   ╚".brightGreen.bgBrightWhite+"█████".brightRed.bgBrightWhite+"╗   ".brightGreen.bgBrightWhite+"██".brightRed.bgBrightWhite+"║  ╚═╝".brightGreen.bgBrightWhite+"███████".brightRed.bgBrightWhite+"║".brightGreen.bgBrightWhite+"█████".brightRed.bgBrightWhite+"╗  ╚".brightGreen.bgBrightWhite+"█████".brightRed.bgBrightWhite+"╗ ╚".brightGreen.bgBrightWhite+"█████".brightRed.bgBrightWhite+"╗ ".brightGreen.bgBrightWhite+"                          ".brightRed.bgBrightWhite);
	console.log(          "                           ██".brightRed.bgBrightWhite+"╔══".brightGreen.bgBrightWhite+"██".brightRed.bgBrightWhite+"╗   ".brightGreen.bgBrightWhite+"██".brightRed.bgBrightWhite+"║    ╚═══".brightGreen.bgBrightWhite+"██".brightRed.bgBrightWhite+"╗  ".brightGreen.bgBrightWhite+"██".brightRed.bgBrightWhite+"║  ".brightGreen.bgBrightWhite+"██".brightRed.bgBrightWhite+"╗".brightGreen.bgBrightWhite+"██".brightRed.bgBrightWhite+"╔══".brightGreen.bgBrightWhite+"██".brightRed.bgBrightWhite+"║".brightGreen.bgBrightWhite+"██".brightRed.bgBrightWhite+"╔══╝   ╚═══".brightGreen.bgBrightWhite+"██".brightRed.bgBrightWhite+"╗ ╚═══".brightGreen.bgBrightWhite+"██".brightRed.bgBrightWhite+"╗                          ".brightGreen.bgBrightWhite);
	console.log(          "                           ██".brightRed.bgBrightWhite+"║  ".brightGreen.bgBrightWhite+"██".brightRed.bgBrightWhite+"║   ".brightGreen.bgBrightWhite+"██".brightRed.bgBrightWhite+"║   ".brightGreen.bgBrightWhite+"██████".brightRed.bgBrightWhite+"╔╝  ╚".brightGreen.bgBrightWhite+"█████".brightRed.bgBrightWhite+"╔╝".brightGreen.bgBrightWhite+"██".brightRed.bgBrightWhite+"║  ".brightGreen.bgBrightWhite+"██".brightRed.bgBrightWhite+"║".brightGreen.bgBrightWhite+"███████".brightRed.bgBrightWhite+"╗".brightGreen.bgBrightWhite+"██████".brightRed.bgBrightWhite+"╔╝".brightGreen.bgBrightWhite+"██████".brightRed.bgBrightWhite+"╔╝                          ".brightGreen.bgBrightWhite);
	console.log(          "                           ╚═╝  ╚═╝   ╚═╝   ╚═════╝    ╚════╝ ╚═╝  ╚═╝╚══════╝╚═════╝ ╚═════╝ ".brightGreen.bgBrightWhite+"                          ".brightRed.bgBrightWhite);
	console.log(          "                                                                                                                        ".brightRed.bgBrightWhite);
	console.log(          "                                                    Jim Marshall - 2021                                                 ".bold.red.bgBrightWhite);
	console.log(          "                                                                                                                        ".bgBrightWhite);
	printBottomDivider();


}
function printTopDivider() {
	console.log("------------------------------------------------------------------------------------------------------------------------");
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
	console.log("------------------------------------------------------------------------------------------------------------------------");
}
function logCyanText(str){
	console.log('\x1b[36m%s\x1b[0m',str);
}

module.exports = {
	printTopDivider,
	printBottomDivider,
	logCyanText,
	printTitle
}