const fs = require("fs");
const xlsx = require("node-xlsx");

xlsx2csv("../private/ccdb/Datenexport/KS_Eingang.xlsx");

function twoDigits(val) {
	if(val.toString().length < 2) {
		return "0" + val;
	}
	return val;
}

function xlD2mysqlD(serial) {
   let utc_days  = Math.floor(serial - 25569);
   let utc_value = utc_days * 86400;                                        
   let date_info = new Date(utc_value * 1000);
   let fractional_day = serial - Math.floor(serial) + 0.0000001;
   let total_seconds = Math.floor(86400 * fractional_day);
   let seconds = total_seconds % 60;
   total_seconds -= seconds;
   let hours = Math.floor(total_seconds / (60 * 60));
   let minutes = Math.floor(total_seconds / 60) % 60;
   return date_info.getUTCFullYear() + "-" + twoDigits(date_info.getUTCMonth()) + "-" + twoDigits(date_info.getUTCDate()) + " " + twoDigits(hours) + ":" + twoDigits(minutes) + ":" + twoDigits(seconds);
}

function xlsx2csv(path) {
	let obj = xlsx.parse(path);
	let rows = [];
	let writeStr = "";
	for(let i=0;i<obj.length;i++) {
		let sheet = obj[i];
		for(let j=0;j<sheet["data"].length;j++) {
			rows.push(sheet["data"][j]);
		}
	}
	for(let k = 0;k<rows.length; k++) {
		for(let l=0;l<rows[k].length;l++) {
			if(typeof(rows[k][l]) === "number") {
				if(rows[k][l].toString().indexOf(".")>-1) rows[k][l] = xlD2mysqlD(rows[k][l]);
			}
		}
		writeStr += rows[k].join(",") + "\n";
	}
	fs.access("../private/ccdb/Datenexport/csv/test.csv",function(err,res) {
		fs.writeFile("../private/ccdb/Datenexport/csv/test.csv", writeStr, function(err) {
			if(err) return console.log(err);
			console.log("csv erstellt");
		});
	})
}