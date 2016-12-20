const request = require("request");
const fs = require("fs");
const xlsx = require("node-xlsx");
const config = require("../private/ccdb/config.json");

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
	followRedirect = followRedirect || true;
	headers = headers || {};
	body = body || {};
	let p = proxy? "http://globalproxy.goc.dhl.com:8080" : "";
	request({
		method: method,
		uri: uri,
		proxy: p,
		followRedirect: followRedirect,
		headers: headers,
		body: body
	},function(err,res,b) {
		if(err) return callback(err);
		callback(null,res);
	})
}

function reqPipe(method,uri,headers,body,followRedirect,proxy) {
	followRedirect = followRedirect || true;
	headers = headers || {};
	body = body || {};
	let p = proxy? "http://globalproxy.goc.dhl.com:8080" : "";
	return request({
		method: method,
		uri: uri,
		proxy: p,
		followRedirect: followRedirect,
		headers: headers,
		body: body
	})
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
		writeStr += rows[k].join(",") + "\n";
	}
	fs.access("../private/ccdb/Datenexport/csv/" + file + ".csv",function(err,res) {
		fs.writeFile("../private/ccdb/Datenexport/csv/" + file + ".csv", writeStr, function(err) {
			if(err) return console.log(err);
			console.log(file + ".csv erstellt");
		});
	})
}

//Novomind Export
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
	novBody = "username=" + config.novomind.username + "&password=" + config.novomind.password;
/*req("POST","https://allyouneed.novomind.com/iMail/index.imail",postHeaders,novBody,false,true,function(err,data) {
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
});*/

//APEX
let apexBody = "p_flow_id=110&p_flow_step_id=101&p_instance=1372326183358022&p_page_submission_id=4422196315294210&p_request" +
			   "=P101_PASSWORD&p_arg_names=7112428763559942&p_t01=0&p_arg_names=7023846395299926&p_t02=" + config.apex.username + "&p_arg_names" +
			   "=7023927573299928&p_t03=" + config.apex.password + "&p_md5_checksum=";

req("POST","http://10.172.253.14:8080/apex/wwv_flow.accept",postHeaders,apexBody,false,false,function(err,data) {
	if(err) return console.log(err);
	console.log(data.headers);
})

