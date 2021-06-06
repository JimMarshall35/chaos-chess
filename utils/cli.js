const colors = require('colors');

function printTitle() {
	printTopDivider();
	console.log(          "                                                                                                                        ");
	console.log(String.raw`                                                                                  _:_                                   `.bold.brightWhite);
	console.log(String.raw`                                                                                 '-.-'                                  `.bold.brightWhite);
	console.log(String.raw`                                                                        ()      __.'.__                                 `.bold.brightWhite);
	console.log(String.raw`                                                                     .-:--:-.  |_______|                                `.bold.brightWhite);
	console.log(String.raw`                                                              ()      \____/    \=====/                                 `.bold.brightWhite);
	console.log(String.raw`                                                              /\      {====}     )___(                                  `.bold.brightWhite);
	console.log(String.raw`                                                   (\=,      //\\      )__(     /_____\                                 `.bold.brightWhite);
	console.log(String.raw`                                   __    |'-'-'|  //  .\    (    )    /____\     |   |                                  `.bold.brightWhite);
	console.log(String.raw`                                  /  \   |_____| (( \_  \    )__(      |  |      |   |                                  `.bold.brightWhite);
	console.log(String.raw`                                  \__/    |===|   ))   \_)  /____\     |  |      |   |                                  `.bold.brightWhite);
	console.log(String.raw`                                 /____\   |   |  (/     \    |  |      |  |      |   |                                  `.bold.brightWhite);
	console.log(String.raw`                                  |  |    |   |   | _.-'|    |  |      |  |      |   |                                  `.bold.brightWhite);
	console.log(String.raw`                                  |__|    )___(    )___(    /____\    /____\    /_____\                                 `.bold.brightWhite);
	console.log(String.raw`                                 (====)  (=====)  (=====)  (======)  (======)  (=======)                                `.bold.brightWhite);
	console.log(String.raw`                                 }===={  }====={  }====={  }======{  }======{  }======={                                `.bold.brightWhite);
	console.log(String.raw`                                (______)(_______)(_______)(________)(________)(_________)                               `.bold.brightWhite);
	console.log(          "                                                                                                                        ".brightRed);
	console.log(          "                                                                                                                        ".brightRed);
	console.log(          "                           ██████".brightRed+"╗ ".brightGreen+"████████".brightRed+"╗ ".brightGreen+"██████".brightRed+"╗   ".brightGreen+"█████".brightRed+"╗ ".brightGreen+"██".brightRed+"╗  ".brightGreen+"██".brightRed+"╗".brightGreen+"███████".brightRed+"╗ ".brightGreen+"██████".brightRed+"╗ ".brightGreen+"██████".brightRed+"╗                          ".brightGreen);
	console.log(          "                           ██".brightRed+"╔══".brightGreen+"██".brightRed+"╗╚══".brightGreen+"██".brightRed+"╔══╝".brightGreen+"██".brightRed+"╔════╝  ".brightGreen+"██".brightRed+"╔══".brightGreen+"██".brightRed+"╗".brightGreen+"██".brightRed+"║  ".brightGreen+"██".brightRed+"║".brightGreen+"██".brightRed+"╔════╝".brightGreen+"██".brightRed+"╔════╝".brightGreen+"██".brightRed+"╔════╝                          ".brightGreen);
	console.log(          "                           ██████".brightRed+"╔╝   ".brightGreen+"██".brightRed+"║   ╚".brightGreen+"█████".brightRed+"╗   ".brightGreen+"██".brightRed+"║  ╚═╝".brightGreen+"███████".brightRed+"║".brightGreen+"█████".brightRed+"╗  ╚".brightGreen+"█████".brightRed+"╗ ╚".brightGreen+"█████".brightRed+"╗ ".brightGreen+"                          ".brightRed);
	console.log(          "                           ██".brightRed+"╔══".brightGreen+"██".brightRed+"╗   ".brightGreen+"██".brightRed+"║    ╚═══".brightGreen+"██".brightRed+"╗  ".brightGreen+"██".brightRed+"║  ".brightGreen+"██".brightRed+"╗".brightGreen+"██".brightRed+"╔══".brightGreen+"██".brightRed+"║".brightGreen+"██".brightRed+"╔══╝   ╚═══".brightGreen+"██".brightRed+"╗ ╚═══".brightGreen+"██".brightRed+"╗                          ".brightGreen);
	console.log(          "                           ██".brightRed+"║  ".brightGreen+"██".brightRed+"║   ".brightGreen+"██".brightRed+"║   ".brightGreen+"██████".brightRed+"╔╝  ╚".brightGreen+"█████".brightRed+"╔╝".brightGreen+"██".brightRed+"║  ".brightGreen+"██".brightRed+"║".brightGreen+"███████".brightRed+"╗".brightGreen+"██████".brightRed+"╔╝".brightGreen+"██████".brightRed+"╔╝                          ".brightGreen);
	console.log(          "                           ╚═╝  ╚═╝   ╚═╝   ╚═════╝    ╚════╝ ╚═╝  ╚═╝╚══════╝╚═════╝ ╚═════╝ ".brightGreen+"                          ".brightRed);
	console.log(          "                                                                                                                        ".brightRed);
	console.log(          "                                                    Jim Marshall - 2021                                                 ".bold.red);
	console.log(          "                                                                                                                        ");
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