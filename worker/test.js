const crypto = require("crypto");
const cipher = crypto.createCipher("aes192","hundearsch");
const fs = require("fs");

/*var text = "deine mama mach kaka";
var c = "";
cipher.on("readable",function() {
	c += cipher.read();
})
cipher.on("end",function() {
	fs.writeFile("enc.txt",c,function() {
		console.log("READY");
	})
})

cipher.write(text);
cipher.end();
*/

var f = fs.createReadStream("enc.txt");
const decipher = crypto.createDecipher("aes192","hundearsch");
/*var d = "";
decipher.on("readable",function() {
	d += decipher.read();
})

decipher.on("end",function() {
	console.log(d);
})
f.pipe(decipher);
*/
f.on("readable",function() {
	var data = f.read();
	if(data)
		console.log(data);
})