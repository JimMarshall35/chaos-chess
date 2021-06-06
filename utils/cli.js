function printTitle() {
	printTopDivider();
	console.log(String.raw`                                                                                  _:_         `);
	console.log(String.raw`                                                                                 '-.-'        `);
	console.log(String.raw`                                                                        ()      __.'.__       `);
	console.log(String.raw`                                                                     .-:--:-.  |_______|      `);
	console.log(String.raw`                                                              ()      \____/    \=====/       `);
	console.log(String.raw`                                                              /\      {====}     )___(        `);
	console.log(String.raw`                                                   (\=,      //\\      )__(     /_____\       `);
	console.log(String.raw`                                   __    |'-'-'|  //  .\    (    )    /____\     |   |        `);
	console.log(String.raw`                                  /  \   |_____| (( \_  \    )__(      |  |      |   |        `);
	console.log(String.raw`                                  \__/    |===|   ))   \_)  /____\     |  |      |   |        `);
	console.log(String.raw`                                 /____\   |   |  (/     \    |  |      |  |      |   |        `);
	console.log(String.raw`                                  |  |    |   |   | _.-'|    |  |      |  |      |   |        `);
	console.log(String.raw`                                  |__|    )___(    )___(    /____\    /____\    /_____\       `);
	console.log(String.raw`                                 (====)  (=====)  (=====)  (======)  (======)  (=======)      `);
	console.log(String.raw`                                 }===={  }====={  }====={  }======{  }======{  }======={      `);
	console.log(String.raw`                                (______)(_______)(_______)(________)(________)(_________)     `);
	console.log(                                                                                                          );
	console.log(                                                                                                          );
	console.log(          "                           ██████╗░████████╗░██████╗  ░█████╗░██╗░░██╗███████╗░██████╗░██████╗");
	console.log(          "                           ██╔══██╗╚══██╔══╝██╔════╝  ██╔══██╗██║░░██║██╔════╝██╔════╝██╔════╝");
	console.log(          "                           ██████╔╝░░░██║░░░╚█████╗░  ██║░░╚═╝███████║█████╗░░╚█████╗░╚█████╗░");
	console.log(          "                           ██╔══██╗░░░██║░░░░╚═══██╗  ██║░░██╗██╔══██║██╔══╝░░░╚═══██╗░╚═══██╗");
	console.log(          "                           ██║░░██║░░░██║░░░██████╔╝  ╚█████╔╝██║░░██║███████╗██████╔╝██████╔╝");
	console.log(          "                           ╚═╝░░╚═╝░░░╚═╝░░░╚═════╝░  ░╚════╝░╚═╝░░╚═╝╚══════╝╚═════╝░╚═════╝░");
	console.log(                                                                                                          );
	console.log(          "                                                    Jim Marshall - 2021                       ");
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