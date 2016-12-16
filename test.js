const fs = require("fs");
const rl = require("readline");

var rd = rl.createInterface({
	input: fs.createReadStream("../../20161215_1356_billiger/billiger.csv",{start:0,end:10000}),
	output: process.stdout
});
rd.on("line",function(line) {
	rd.close();
})
rd.on("close",function() {
	console.log("\n-------CLOSE------");
})
