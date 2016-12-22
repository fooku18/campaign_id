const crypto = require("crypto");
const fs = require("fs");

function enc(t,p) {
	let c = crypto.createCipher("aes192",p);
	let cr = c.update(t,"utf8","hex");
	cr += c.final("hex");
	return cr;
}

function dec(t,p) {
	let d = crypto.createDecipher("aes192",p);
	try {
		let dr = d.update(t,"hex","utf8");
		dr += d.final("utf8");
		return [dr,1];
	} catch(e) {
		return ["Passwort falsch",0];
	}
}

function cJSON() {
	return {
		novo: {
			username: arguments[0],
			password: arguments[1]
		},
		apex: {
			username: arguments[2],
			password: arguments[3]
		}
	}
}

if(process.argv[2] == "-c") {
	let tNovo = process.argv[3];
	let pNovo = process.argv[4];
	let tAPEX = process.argv[5];
	let pAPEX = process.argv[6];
	
	try {
		let encoded = enc(JSON.stringify(cJSON(tNovo,pNovo,tAPEX,pAPEX)),process.argv[7]);
		fs.writeFile("../private/ccdb/cip.file",encoded,function(err) {
			if(err) console.log(err);
		})
	} catch(e) {
		console.log("Fehler: " + e);
	}
}

if(process.argv[2] == "-r") {
	let p = process.argv[3];
	
	fs.readFile("../private/ccdb/cip.file",{encoding:"utf8"},function(err,data) {
		let decoded = dec(data,p);
		if(decoded[1]) console.log(JSON.parse(decoded[0]));
	})
}

module.exports.dec = function(file,pw) {
	fs.readFile(file,{encoding:"utf8"},function(err,data) {
		let decoded = dec(data,pw);
		if(decoded[1]) return JSON.parse(decoded[0]);
	})
}