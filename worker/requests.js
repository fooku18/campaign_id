if(!process.argv[2]) return console.log("Zweites Argument 'Secret' fehlt");
process.stdout.write("\033c");
const request = require("request");
const mysql = require("mysql");
const fs = require("fs");
const xlsx = require("node-xlsx");
const dom = require("xmldom").DOMParser;
const crypt = require("./cipher.js");
const config = crypt.decipher("../private/ccdb/cip.file",process.argv[2]);
const exec = require("child_process").exec;
const path = require("path");
const __dir = path.dirname(require.main.filename);


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
/*
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
		let wS = fs.createWriteStream("../private/ccdb/Datenexport/" + fileName + ".xlsx",{defaultEncoding:'utf8'});
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
   return date_info.getUTCFullYear() + "-" + twoDigits(date_info.getUTCMonth() + 1) + "-" + twoDigits(date_info.getUTCDate()) + " " + twoDigits(hours) + ":" + twoDigits(minutes) + ":" + twoDigits(seconds);
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
		writeStr += rows[k].join("|") + "\n";
	}
	fs.access("../private/ccdb/Datenexport/csv/" + file + ".csv",function(err,res) {
		fs.writeFile("../private/ccdb/Datenexport/csv/" + file + ".csv", writeStr, function(err) {
			if(err) return console.log(err);
			console.log(file + ".csv erstellt");
		});
	})
}
*/
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
	novBody = "username=" + config.novo.username + "&password=" + config.novo.password;/*
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
*/
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

function download(url,type,header,table) {
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
			let wS = fs.createWriteStream("../private/ccdb/Datenexport/csv/" + type + "_bestellungen.csv");
			wS.on("finish",function() {
				console.log(type + "_bestellungen.csv erstellt");
				createTemp(table);
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
		let ord90 = findMyWay([1,1,0,1,0,0,1],doc.getElementById(14000).nextSibling).getAttribute("href");ord90 = "http://10.172.253.14:8080/apex/" + ord90;
		download(ordAYNurl,"AYN",headerGET,"ayn_bestellungen");
		download(ordPPurl,"PP",headerGET,"pp_bestellungen");
		//download(ord90,"kunden",headerGET,"kunden_bestellungen");
	})
})

function createTemp(table) {
	let opt = {
		host: "localhost",
		user: "ccdb",
		database: "ccdb",
		password: "ccdb"
	}
	function _qND(tN) {
		var id = tN == "ks_chat"? "ID" : "TICKET_ID";
		var date = tN == "ks_chat"? "CHAT_START" : "RECEIVE_DATE";
		return "DELETE FROM " + tN + " WHERE " + id + " IN ( " +
					"SELECT * FROM ( " + 
						"SELECT " + tN + "." + id + " FROM " + tN + " " + 
						"LEFT OUTER JOIN " + tN + "_temp " +
						"ON " + tN + "." + id + " = " + tN + "_temp." + id + " " +
						"WHERE (DATE(" + tN + "." + date + ") " +
						"BETWEEN " +
						"(SELECT MIN(DATE(" + date + ")) FROM " + tN + "_temp) " +
						"AND " +
						"(SELECT MAX(DATE(" + date + ")) FROM " + tN + "_temp) " + 
						") AND " + tN + "_temp." + id + " is null " +
					") AS t " + 
				");"
	}
	function _qNI(tN) {
		let _i = (tN == "ayn_bestellungen" || tN == "pp_bestellungen")? "tag" : (tN == "ks_chat")? "ID" : "TICKET_ID";
		return "INSERT INTO " + tN + " SELECT tN.* FROM ( " +
					"SELECT " + tN + "_temp.* FROM " + tN + " " +  
					"RIGHT OUTER JOIN " + tN + "_temp " +
					"ON " + tN + "." + _i + " = " + tN + "_temp." + _i + " " + 
					"WHERE " + tN + "." + _i + " is null " +
				") AS tN;";
	}
	function _qNU(tN) {
		if(tN != "ks_chat") {
			return "UPDATE " + tN + " t1 " + 
				"INNER JOIN " + tN + "_temp t2 " +
				"ON t1.ticket_id = t2.ticket_id " + 
				"SET t1.TICKET_ID = t2.TICKET_ID, " + 
				"t1.PROCESS_ID = t2.PROCESS_ID, " +
				"t1.RECEIVE_DATE = t2.RECEIVE_DATE, " +
				"t1.LAST_DATE_PROCESSED = t2.LAST_DATE_PROCESSED, " +
				"t1.DATE_TOUCHED = t2.DATE_TOUCHED, " +
				"t1.CATEGORY = t2.CATEGORY, " +
				"t1.MANDATOR = t2.MANDATOR, " +
				"t1.TEMPLATE = t2.TEMPLATE, " +
				"t1.EDIT_TIME_IN_MS = t2.EDIT_TIME_IN_MS, " +
				"t1.RECATEGORIZED_TO = t2.RECATEGORIZED_TO, " +
				"t1.RECATEGORIZED_FROM = t2.RECATEGORIZED_FROM, " +
				"t1.TEMPLATE_OUT = t2.TEMPLATE_OUT, " +
				"t1.INCOMING_ADDRESS = t2.INCOMING_ADDRESS, " +
				"t1.INCOMING_ACCOUNT = t2.INCOMING_ACCOUNT, " +
				"t1.SENDER = t2.SENDER, " +
				"t1.LANGUAGE = t2.LANGUAGE, " +
				"t1.LOCATION = t2.LOCATION, " +
				"t1.STATUS = t2.STATUS, " +
				"t1.TRANSACTION_CODE = t2.TRANSACTION_CODE, " +
				"t1.SHOP_ID = t2.SHOP_ID, " +
				"t1.BESTELLNUMMER = t2.BESTELLNUMMER, " +
				"t1.KUNDENNUMMER = t2.KUNDENNUMMER  " +
				"WHERE t1.ticket_id = t2.ticket_id; ";
		} else {
			return "UPDATE " + tN + " t1 " + 
				"INNER JOIN " + tN + "_temp t2 " +
				"ON t1.ID = t2.ID " + 
				"SET t1.ID = t2.ID, " + 
				"t1.CATEGORY = t2.CATEGORY, " +
				"t1.CHAT_START = t2.CHAT_START, " +
				"t1.CHAT_END = t2.CHAT_END, " +
				"t1.DURATION_ROUTING = t2.DURATION_ROUTING, " +
				"t1.DURATION_REVIEW = t2.DURATION_REVIEW, " +
				"t1.TRANSACTIONCODE = t2.TRANSACTIONCODE " +
				"WHERE t1.ID = t2.ID;";
		}
	}
	function _qBU(tN) {
		if(tN.match(/pp/i)) {
			return "UPDATE " + tN + " t1 " + 
				"INNER JOIN " + tN + "_temp t2 " +
				"ON t1.tag = t2.tag " + 
				"SET t1.wochentag = t2.wochentag, " + 
				"t1.anzahl_kunden = t2.anzahl_kunden, " +
				"t1.anzahl_warenkoerbe = t2.anzahl_warenkoerbe, " +
				"t1.ds_anzahl_produkte = t2.ds_anzahl_produkte, " +
				"t1.umsatz = t2.umsatz, " +
				"t1.versandkosten = t2.versandkosten, " +
				"t1.gesamtumsatz = t2.gesamtumsatz, " +
				"t1.ds_warenkorbwert = t2.ds_warenkorbwert, " +
				"t1.stornierungsquote = t2.stornierungsquote, " +
				"t1.retourenquote = t2.retourenquote " +
				"WHERE t1.tag = t2.tag;";
		} else {
			return "UPDATE " + tN + " t1 " + 
				"INNER JOIN " + tN + "_temp t2 " +
				"ON t1.tag = t2.tag " + 
				"SET t1.wochentag = t2.wochentag, " + 
				"t1.anzahl_kunden = t2.anzahl_kunden, " +
				"t1.anzahl_warenkoerbe = t2.anzahl_warenkoerbe, " +
				"t1.anzahl_bestellungen = t2.anzahl_bestellungen, " +
				"t1.anzahl_produkte = t2.anzahl_produkte, " +
				"t1.umsatz = t2.umsatz, " +
				"t1.versandkosten = t2.versandkosten, " +
				"t1.gesamtumsatz = t2.gesamtumsatz, " +
				"t1.ds_warenkorbwert = t2.ds_warenkorbwert, " +
				"t1.stornierungsquote = t2.stornierungsquote " +
				"WHERE t1.tag = t2.tag;";
		}
	}
	
	let t = table;
	const connection = mysql.createConnection(opt);
	let qS = "";
	connection.query("SHOW COLUMNS FROM " + t + ";",function(err,data) {
		data.forEach(function(v,i){
			qS += v.Field + " " + v.Type + ",";
		})
		qS = "(" + qS.substr(0,qS.length-1) + ")"; 
		connection.query("CREATE TABLE " + t + "_temp " + qS + ";",function(err,data) {
			if(err) console.log(err);
			//let l =  __dir.replace(/\\/g,"/").replace(/worker\/?/,"") + 'private/ccdb/sql/' + table + '.sql';
			let l = __dir.replace(/\\/g,"/").replace(/worker\/?/,"") + 'private/ccdb/sql/' + t + '.sql';
			let lQ = __dir.replace(/\\/g,"/").replace(/worker\/?/,"") + 'private/ccdb/Datenexport/csv/' + t + '.csv';
			let _qual = (t == "ayn_bestellungen" || t == "pp_bestellungen" || t == "kunden_bestellungen")? ";" : "|";
			let q = "USE ccdb; " +
					"LOAD DATA LOCAL INFILE '" + lQ + "' INTO TABLE " + t + "_temp  " +
					"CHARACTER SET UTF8 FIELDS TERMINATED BY '" + _qual + "' OPTIONALLY ENCLOSED BY '\"' LINES TERMINATED BY '\n' IGNORE 1 LINES;"
			fs.writeFile(l,q,function(err,data) {
				exec("mysql -u " + opt.user + " -p" + opt.password + " < \"" + l + "\"",function(err,stdout,stderr) {
					if(err) console.log(err);
					if(!err) {
						if(!t.match(/ayn|pp/i)) {
							connection.query(_qND(t),function(err,data) {
								if(err) console.log(err);
								if(!err) {
									connection.query(_qNU(t),function(err,data) {
										if(err) console.log(err);
										if(!err) {
											connection.query(_qNI(t),function(err,data) {
												if(err) console.log(err);
												if(!err) {
													connection.query("DROP TABLE " + t + "_temp;",function(err,data) {
														console.log(t + " erfolgreich aktualisiert");
														connection.end();
													})
												}
											})
										}
									})
								}
							})
						} else {
							connection.query(_qNI(t),function(err,data) {
								if(err) console.log(err);
								if(!err) {
									connection.query(_qBU(t),function(err,data) {
										if(err) console.log(err);
										if(!err) {
											/*connection.query("DROP TABLE " + t + "_temp;",function(err,data) {
												console.log(t + " erfolgreich aktualisiert");
												connection.end();
											})*/
											connection.end();
										}
									})
								}
							})
						}
					}
				})
			})
		})
	})
}