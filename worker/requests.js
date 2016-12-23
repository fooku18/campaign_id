if(!process.argv[2]) return console.log("Zweites Argument 'Secret' fehlt");
process.stdout.write("\033c");
const request = require("request");
const mysql = require("mysql");
const fs = require("fs");
const xlsx = require("node-xlsx");
const dom = require("xmldom").DOMParser;
const crypt = require("./cipher.js");
const config = crypt.decipher("../private/ccdb/cip.file",process.argv[2]);

/*
function twoDigits(val) {
	if(val.toString().length < 2) {
		return "0" + val;
	}
	return val;
}

function parseCookie(headers) {
	let jar = [];
	for(let i in headers["set-cookie"]) {
		jar.push(headers["set-cookie"][i]);
	}
	res = [jar];
	if(headers["location"]) res.push(headers["location"].split(";")[0]);
	return res;
}

function req(method,uri,headers,body,followRedirect,proxy,callback) {
	opt = {
		method: method,
		uri: uri
	};
	if(followRedirect) opt.followRedirect;
	if(headers) opt.headers = headers;
	if(body) opt.body =body;
	if(proxy) opt.proxy = "http://globalproxy.goc.dhl.com:8080";
	request(opt,function(err,res,b) {
		if(err) return callback(err);
		callback(null,res);
	})
}

function reqPipe(method,uri,headers,body,followRedirect,proxy) {
	opt = {
		method: method,
		uri: uri
	};
	if(followRedirect) opt.followRedirect;
	if(headers) opt.headers = headers;
	if(body) opt.body =body;
	if(proxy) opt.proxy = "http://globalproxy.goc.dhl.com:8080";
	return request(opt);
}

function paraBuilderNovo(type,date,t) {
	let now = date;
	let tM = t;
	body = "startDate=" + now.getTime() - tM + "&endDate=" + now.getTime() + "&action=executeDataExport&dataExportPath=%2Fsrv%2Fnovomind" +
		   "%2FiAGENT%2FdataExport%2F&chosenId=" + rQ[type].id + "&cats=&downloadToken=" + now.getTime() + "&checkbox_del_cat=&fromField" +
		   "=" + twoDigits(new Date(now.getTime() - tM).getDay()) + "." + twoDigits(new Date(now.getTime() - tM).getMonth()) + "." + new Date(now.getTime() - tM).getFullYear() + "+00%3A00%3A00&toField=" + 
		   twoDigits(now.getDay()) + twoDigits(now.getMonth()) + now.getFullYear() + "+00%3A00%3A00&file=" + rQ[type].id + "&cats=" + rQ[type].cats;
	return body;
}

function writeFileNovo(fileName,postHeaders,novBody) {
	fs.access("../private/ccdb/Datenexport/" + fileName + ".xlsx",function(err,res) {
		if(err) fs.writeFileSync("../private/ccdb/Datenexport/" + fileName + ".xlsx");
		let wS = fs.createWriteStream("../private/ccdb/Datenexport/" + fileName + ".xlsx");
		wS.on("finish",function(res) {
			xlsx2csv("../private/ccdb/Datenexport/" + fileName + ".xlsx",fileName);
		})
		reqPipe("POST","https://allyouneed.novomind.com/iMail/selectDataExportActions.imail",postHeaders,novBody,false,true).pipe(wS);
	})
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

function xlsx2csv(path,file) {
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
	fs.access("../private/ccdb/Datenexport/csv/" + file + ".csv",function(err,res) {
		fs.writeFile("../private/ccdb/Datenexport/csv/" + file + ".csv", writeStr, function(err) {
			if(err) return console.log(err);
			console.log(file + ".csv erstellt");
		});
	})
}

//Novomind
let rQ = {
	"KS_Eingang": {
		id: 104,
		cats: 1409
	},
	"HS_Reporting": {
		id: 104,
		cats: 299
	},
	"KS_Chat": {
		id: 103,
		cats: 1297
	}
}
let postHeaders = {
	"Content-Type": "application/x-www-form-urlencoded"
},
	novBody = "username=" + config.novo.username + "&password=" + config.novo.password;
req("POST","https://allyouneed.novomind.com/iMail/index.imail",postHeaders,novBody,false,true,function(err,data) {
	if(err) return console.log(err);
	let cookie = parseCookie(data.headers)[0];
	let now = new Date();
	let tM = 1000*60*60*24*90 // 90 days in ms
	let postHeaders = {
		"Content-Type": "application/x-www-form-urlencoded",
		"Cookie": cookie[0]
	}
	
	for(let i in rQ) {
		writeFileNovo(i,postHeaders,paraBuilderNovo(i,now,tM));
	}
});

//APEX
function findMyWay(path,node) {
	path.forEach(function(l) {
		node = l? node.firstChild : node.nextSibling;
	})
	return node;
}

function findAttribute(id,attr,template) {
	let doc = new dom().parseFromString(template,"text/html");
	return doc.getElementById(id).getAttribute(attr);
}

function download(url,type,header) {
	req("GET",url,header,null,true,false,function(err,data) {
		if(err) console.log(err);
		let template = data.body;
		let apexir_WORKSHEET_ID = findAttribute("apexir_WORKSHEET_ID","value",template);
		let apexir_REPORT_ID = findAttribute("apexir_REPORT_ID","value",template);
		let pFlowId = findAttribute("pFlowId","value",template);
		let pFlowStepId = findAttribute("pFlowStepId","value",template);
		let pInstance = findAttribute("pInstance","value",template);
		let apexBody = "p_request=APXWGT&p_instance=" + pInstance + "&p_flow_id=" + pFlowId + "&p_flow_step_id=" + pFlowStepId + "&p_widget_name=worksheet&p_widget_mod=CONTROL&p_widget_action=SHOW_DOWNLOAD&x01=" + apexir_WORKSHEET_ID + "&x02=" +apexir_REPORT_ID;
		headerPOST = Object.assign({},header);headerPOST["Content-Type"] = "application/x-www-form-urlencoded";
		req("POST","http://10.172.253.14:8080/apex/wwv_flow.show",headerPOST,apexBody,true,false,function(err,data) {
			if(err) console.log(err);
			let url = /f\?.*:CSV:/.exec(data.body);url = "http://10.172.253.14:8080/apex/" + url;
			let wS = fs.createWriteStream("../private/ccdb/Datenexport/csv/" + type + "Bestellungen.csv");
			wS.on("finish",function() {
				console.log(type + "Bestellungen.csv erstellt");
			});
			reqPipe("GET",url,header,null,true,false).pipe(wS);
		})
	})
}

let apexBody = "p_flow_id=110&p_flow_step_id=101&p_instance=1372326183358022&p_page_submission_id=4422196315294210&p_request" +
			   "=P101_PASSWORD&p_arg_names=7112428763559942&p_t01=0&p_arg_names=7023846395299926&p_t02=" + config.apex.username + "&p_arg_names" +
			   "=7023927573299928&p_t03=" + config.apex.password + "&p_md5_checksum=";

req("POST","http://10.172.253.14:8080/apex/wwv_flow.accept",postHeaders,apexBody,false,false,function(err,data) {
	if(err) return console.log(err);
	let cookie = parseCookie(data.headers)[0];
	let location = parseCookie(data.headers)[1];
	let headerGET = {
		"Cookie": cookie.join(""),
		"Connection": "keep-alive"
	};
	let headerPOST = {
		"Cookie": cookie.join(""),
		"Connection": "keep-alive",
		"Content-Type": "application/x-www-form-urlencoded"
	};
	req("GET",location,headerGET,null,false,false,function(err,data) {
		let template = data.body;
		let doc = new dom().parseFromString(template,"text/html");
		let ordAYNurl = findMyWay([1,0,1,0,1,1],doc.getElementById(14000).nextSibling).getAttribute("href");ordAYNurl = "http://10.172.253.14:8080/apex/" + ordAYNurl;
		let ordPPurl = findMyWay([1,0,0,1,0,1,1],doc.getElementById(16000).nextSibling).getAttribute("href");ordPPurl = "http://10.172.253.14:8080/apex/" + ordPPurl;
		download(ordAYNurl,"AYN",headerGET);
		download(ordPPurl,"PP",headerGET);
	})
})

*/
//temp tables
let opt = {
	host: "localhost",
	user: "root",
	database: "ccdb",
	password: ""
}
function createTemp(table) {
	const connection = mysql.createConnection(opt);
	let qS = "";
	connection.query("SHOW COLUMNS FROM " + table + ";",function(err,data) {
		data.forEach(function(v,i){
			qS += v.Field + " " + v.Type + ",";
		})
		qS = "(" + qS.substr(0,qS.length-1) + ")"; 
		//connection.query("CREATE TABLE " + table + "_temp " + qS,function(err,data) {
			//if(err) console.log(err);
			let p = 'C:\\Users\\j6er8a\\Desktop\\Projekt\\node\\private\\ccdb\\Datenexport\\csv\\' + table + '.csv';console.log(p);
			let q = mysql.format("LOAD DATA LOCAL INFILE ?? INTO TABLE ? CHARACTER SET 'utf8' FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' IGNORE 1 LINES;",[p,table]);
			console.log(q);
			connection.query(q,function(err,data) {
				console.log(err);
				console.log(data);
			})
		//})
	})
}

createTemp("ks_eingang");