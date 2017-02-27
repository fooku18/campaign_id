"use strict";
const mysql = require("mysql");
const mysql_config = require("../../db/mysql_config_ccdb.js");
const fs = require("fs");
const path = require('path');
const __dir = path.dirname(require.main.filename);
const service_config = require(__dir + "/private/ccdb/service_config.json");

const con = mysql.createConnection({
	host: "localhost",
	user: "ccdb",
	password: "ccdb",
	database: "ccdb"
})

function qryBuilder(t,b,e) {
	switch (t) {
		case "kq":
			return "(SELECT tA.d,tA.ayn as tAYN,SUM(tA.ppde) as tPPDE,SUM(tA.ppaut) as tPPAUT,SUM(tA.hs) as tHS,SUM(tB.ayn) as oAYN,SUM(tB.pp) as oPP FROM " +
						"(SELECT t1.d,SUM(IF(t1.service=\"ayn\",1,0)) as ayn,SUM(IF(t1.service=\"ppde\",1,0)) as ppde,SUM(IF(t1.service=\"ppaut\",1,0)) as ppaut,SUM(IF(t1.service=\"hs\",1,0)) as hs FROM ( " +
							"(SELECT DATE(RECEIVE_DATE) as d,CASE WHEN category COLLATE latin1_general_cs like \"%AYN%\" THEN \"ayn\" " +
								 "WHEN incoming_address = \"austria@postpay.de\" then \"ppaut\" " +
								 "WHEN category COLLATE latin1_general_cs like \"%PP%\" THEN \"ppde\" " +
								 "WHEN incoming_address like \"%allyouneed%\" THEN \"ayn\" " +
								 "WHEN incoming_address like \"%meinpaket%\" THEN \"ayn\" " +
								 "ELSE \"ppde\" END as service " +
							"FROM ks_eingang WHERE (DATE(RECEIVE_DATE) BETWEEN '" + b + "' AND '" + e + "')) " +
							"UNION ALL " +
							"(SELECT DATE(CHAT_START),CASE WHEN category COLLATE latin1_general_cs like \"%AYN%\" THEN \"ayn\" " +
								   "WHEN category COLLATE latin1_general_cs like \"%PP%\" THEN \"ppde\" " +
								   "END as service " +
							"FROM ks_chat WHERE (DATE(CHAT_START) BETWEEN '" + b + "' AND '" + e + "')) " +
							"UNION ALL " +
							"(SELECT DATE(RECEIVE_DATE),\"hs\" as service FROM hs_reporting WHERE (DATE(RECEIVE_DATE) BETWEEN '" + b + "' AND '" + e + "')) " +
						") as t1 " +
						"GROUP BY d) as tA " +
					"INNER JOIN " +
						"(SELECT t1.tag,SUM(IF(t1.service=\"ayn\",t1.anzahl_bestellungen,0)) as ayn,SUM(IF(t1.service=\"pp\",t1.anzahl_bestellungen,0)) as pp from ( " +
							"SELECT tag,anzahl_bestellungen,\"ayn\" as service from ayn_bestellungen WHERE (tag BETWEEN '" + b + "' AND '" + e + "') " +
							"UNION ALL " +
							"SELECT tag,anzahl_warenkoerbe,\"pp\" as service from pp_bestellungen WHERE (tag BETWEEN '" + b + "' AND '" + e + "') " +
						") as t1 " +
						"WHERE t1.tag != \"0000-00-00\" " +
						"GROUP BY tag) as tB " +
					"ON tA.d = tB.tag " +
					"GROUP BY tA.d) as tN";
		break;
	}
}

function kqWorker(o,si) {
	let s = si.substr(1,si.length-2).split(",");
	let lA = si.match(/ayn/)? !0 : 0;
	let lP = si.match(/pp/)? !0 : 0;
	let lH = si.match(/hs/)? !0 : 0;
	let aO = [];
	lA||lH? aO.push("oA") : null;
	lP? aO.push("oP") : null;
	function sum(o,m) {
		var a = m=="t"? s : aO;
		var e=0;
		a.forEach(function(l) {
			e += o[l];
		})
		return e;
	}
	let r = [];
	for(let i in o) {
		r.push({
			d: o[i].d,
			t: sum(o[i],"t"),
			o: sum(o[i],"o")
		})
		r[i].kq = r[i].t/r[i].o;
	}
	return r
}

module.exports.kq = function(b,e,g,s,cb) {
	let t = g=="year"? "year(tN.d)" : g=="day"? "CONCAT(day(tN.d),'.',month(tN.d),'.',year(tN.d))" : g=="week"? "CONCAT(week(tN.d,3),\"/\",year(tN.d))" : "CONCAT(month(tN.d),'/',year(tN.d))";
	let gran = g=="year"? "year(tN.d)" : g=="month"? "year(tN.d),month(tN.d)" : g=="week"? "year(tN.d),week(tN.d,3)" : "tN.d";
	let qry = qryBuilder("kq",b,e);
	qry = "SELECT " + t + " as d,SUM(tN.tAYN) as checkayn,SUM(tN.tPPDE) as checkppde,SUM(tN.tPPAUT) as checkppaut,SUM(tN.tHS) as checkhs,SUM(tN.oAYN) as oA,SUM(tN.oPP) as oP,year(tN.d) as y,month(tN.d) as m, day(tN.d) as da FROM " +
		  qry +
		  " GROUP BY " + gran + " " +
		  " ORDER BY y ASC, m ASC, da ASC;";
	con.query(qry,function(err,res) {
		let nr = kqWorker(res,s);
		if(err) return cb(err);
		cb(null,nr);
	})
}

module.exports.tt_init = function(b,e,s,cb) {
	let a = [];
	let cA = 0,
		cP = 0;
	if(s.match(/checkayn/)) {
		a.push("tN.SA = 'AYN'");
		cA = !cA;
	}
	s.match(/checkppde/)? a.push("tN.SA = 'PPDE'") : null;
	s.match(/checkppaut/)? a.push("tN.SA = 'PPAUT'") : null;
	s.match(/checkppde|checkppaut/)? cP = !cP : null;
	let cH = cA? cP? "AND INSTR(CATEGORY,'_AYN_') OR INSTR(CATEGORY,'_PP_')" : "AND INSTR(CATEGORY,'_AYN_')" :cP? "AND INSTR(CATEGORY,'_PP_')" : "AND false";
	let	lH = s.match(/checkhs/)? !!0 : !0;
	let q = !a.length? "false" : a.join(" OR ");
	let qry =   '(SELECT tN.C,"ks-eingang" AS S FROM ' +
				'(' +
					'SELECT CATEGORY AS C, ' +
					'CASE WHEN INSTR(CATEGORY,"_AYN_") THEN "AYN" ' +
					'WHEN INCOMING_ADDRESS = "austria@postpay.de" THEN "PPAUT" ' +
					'WHEN INSTR(CATEGORY,"_PP_") THEN "PPDE" ' +
					'WHEN INSTR(INCOMING_ADDRESS,"meinpaket") THEN "AYN" ' +
					'WHEN INSTR(INCOMING_ADDRESS,"allyouneed") THEN "AYN" ' +
					'ELSE "PPDE" END AS SA ' +
					"FROM ks_eingang WHERE CATEGORY IS NOT NULL AND (DATE(RECEIVE_DATE) BETWEEN '" + b + "' AND '" + e + "') " +
				') AS tN ' +
				'WHERE ' + q + ' ' +
				'GROUP BY tN.C) ' +
				"UNION ALL " +
				"(SELECT DISTINCT(CATEGORY) AS C,\"ks-chat\" FROM ks_chat WHERE CATEGORY IS NOT NULL AND (DATE(CHAT_START) BETWEEN '" + b + "' AND '" + e + "') " + cH + " ORDER BY C ASC) " +
				"UNION ALL " +
				"(SELECT DISTINCT(CATEGORY) AS C,\"hs-reporting\" FROM hs_reporting WHERE CATEGORY IS NOT NULL AND (DATE(RECEIVE_DATE) BETWEEN '" + b + "' AND '" + e + "') AND " + lH + " ORDER BY C ASC);";
	con.query(qry,function(err,res) {
		if(err) cb(err);
		cb(null,res);
	})
}

module.exports.tt_cat = function(b,e,s,g,a,t,sn,cb) {
	let sa = s.substr(1,s.length-2).split(",");
	let trans = {
		"checkayn": "AYN",
		"checkppde": "PPDE",
		"checkppaut": "PPAUT",
		"checkhs": "HS"
	}
	let ha = function() {
		let r = "";
		for(let i in sa) {
			r += "tN.S = '" + trans[sa[i]] + "' || ";
		}
		return r.substr(0,r.length-3);
	}
	let ser = ha();
	let oT = {
		"ks-eingang":[],
		"ks-chat":[],
		"hs-reporting":[]
	}
	a.forEach(function(l) {
		let t = l.split(":");
		oT[t[1]].push(t[0]);
	})
	let ks = s.indexOf("ayn") > - 1 || s.indexOf("pp") > - 1? true : false;
	let hs = s.indexOf("hs") > - 1? true : false;
	let ty = sn.indexOf("MAIL") > -1? "MAIL" : sn.indexOf("CALL") > -1? "CALL" : "CHAT";
	let eaMC = sn.match(/Eingang/i)? "RECEIVE_DATE" : "LAST_DATE_PROCESSED";
	let eaC = sn.match(/Eingang/i)? "CHAT_START" : "CHAT_END";
	if(g == "month") {
		var _ = t.split("/");
		var _q = "WHERE MONTH(DATE(" + eaMC + ")) = " + _[0] + " AND YEAR(DATE(" + eaMC + ")) = " + _[1];
		var _qc = "WHERE MONTH(DATE(" + eaC + ")) = " + _[0] + " AND YEAR(DATE(" + eaC + ")) = " + _[1];
	}
	if(g == "week") {
		var _ = t.split("/");
		var _q = "WHERE WEEK(DATE(" + eaMC + "),3) = " + _[0] + " AND YEAR(DATE(" + eaMC + ")) = " + _[1];
		var _qc = "WHERE WEEK(DATE(" + eaC + "),3) = " + _[0] + " AND YEAR(DATE(" + eaC + ")) = " + _[1];
	}
	if(g == "year") {
		var _q = "WHERE YEAR(DATE(" + eaMC + ")) = " + t;
		var _qc = "WHERE YEAR(DATE(" + eaC + ")) = " + t;
	}
	if(g == "day") {
		function mysql(d) {
			var t = d.substr(0,2);
			var m = d.substr(3,2);
			var y = d.substr(6,4);
			return y + "-" + m + "-" + t;
		}
		var _q = "WHERE DATE(RECEIVE_DATE) = '" + mysql(t) + "'";
		var _qc = "WHERE DATE(CHAT_START) = '" + mysql(t) + "'";
	}
	let qry = 	"SELECT tN.C AS C,COUNT(tN.C) AS CNT FROM " +
				"((SELECT CATEGORY AS C, " +
				"CASE WHEN INSTR(TRANSACTION_CODE,'AYN_') THEN 'AYN' " +
				"WHEN INCOMING_ADDRESS = 'austria@postpay.de' THEN 'PPAUT' " +
				"WHEN INSTR(TRANSACTION_CODE,'PP_') THEN 'PPDE' " +
				"WHEN INSTR(INCOMING_ADDRESS,'meinpaket') THEN 'AYN' " +
				"WHEN INSTR(INCOMING_ADDRESS,'allyouneed') THEN 'AYN' " +
				"ELSE 'PPDE' END AS S, " +
				"IF(INSTR(TEMPLATE,'CALL'),'CALL','MAIL') AS T " +
				"FROM ks_eingang " +
				_q + " AND " + ks + " " +
				"AND CATEGORY IN ('" + oT["ks-eingang"].join("','") + "')) " +
				"UNION ALL " +
				"(SELECT CATEGORY AS C,'AYN' AS S, " +
				"IF(INSTR(TEMPLATE,'CALL'),'CALL','MAIL') AS T " +
				"FROM hs_reporting " +
				_q + " AND " + hs + " " +
				"AND CATEGORY IN ('" + oT["hs-reporting"].join("','") + "')) " +
				"UNION ALL " +
				"(SELECT CATEGORY AS C, " +
				"CASE WHEN INSTR(CATEGORY,'AYN_') THEN 'AYN' " +
				"ELSE 'PPDE' END AS S, " +
				"'CHAT' AS T " +
				"FROM ks_chat " +
				_qc + " AND " + ks + " " +
				"AND CATEGORY IN ('" + oT["ks-chat"].join("','") + "')) " +
				") AS tN " +
				"WHERE (" + ser + ") AND tN.T = '" + ty + "' " +
				"GROUP BY tN.C " +
				"ORDER BY COUNT(tN.C) DESC;";
	con.query(qry,function(err,res) {
		if(err) console.log(err);
		cb(null,res);
	})
}

module.exports.tt_ab = function(t,g,ty,c,cb) {
	let _g = g.split("-")[1];
	let _ty = ty.indexOf("MAIL") > -1? "MAIL" : ty.indexOf("CALL") > -1? "CALL" : "CHAT";
	let eaMC = ty.match(/Eingang/i)? "RECEIVE_DATE" : "LAST_DATE_PROCESSED";
	let eaC = ty.match(/Eingang/i)? "CHAT_START" : "CHAT_END";
	let _q,_qc;
	if(_g == "month") {
		let _ = t.split("/");
		_q = "WHERE MONTH(DATE(" + eaMC + ")) = " + _[0] + " AND YEAR(DATE(" + eaMC + ")) = " + _[1];
		_qc = "WHERE MONTH(DATE(" + eaC + ")) = " + _[0] + " AND YEAR(DATE(" + eaC + ")) = " + _[1];
	}
	if(_g == "week") {
		let _ = t.split("/");
		_q = "WHERE WEEK(DATE(" + eaMC + "),3) = " + _[0] + " AND YEAR(DATE(" + eaMC + ")) = " + _[1];
		_qc = "WHERE WEEK(DATE(" + eaC + "),3) = " + _[0] + " AND YEAR(DATE(" + eaC + ")) = " + _[1];
	}
	if(_g == "year") {
		_q = "WHERE YEAR(DATE(" + eaMC + ")) = " + t;
		_qc = "WHERE YEAR(DATE(" + eaC + ")) = " + t;
	}
	if(_g == "day") {
		function mysql(d) {
			let t = d.substr(0,2);
			let m = d.substr(3,2);
			let y = d.substr(6,4);
			return y + "-" + m + "-" + t;
		}
		_q = "WHERE DATE(RECEIVE_DATE) = '" + mysql(t) + "'";
		_qc = "WHERE DATE(CHAT_START) = '" + mysql(t) + "'";
	}
	let qry = "SELECT tN.TC AS C, COUNT(tN.TC) AS CNT FROM " +
						"(SELECT TRANSACTION_CODE AS TC, IF(INSTR(TEMPLATE,'CALL'),'CALL','MAIL') AS SER FROM ks_eingang " +
						_q + " " +
						"AND CATEGORY = '" + c + "' " +
						"UNION ALL " +
						"SELECT TRANSACTION_CODE, IF(INSTR(TEMPLATE,'CALL'),'CALL','MAIL') FROM hs_reporting " +
						_q + " " +
						"AND CATEGORY = '" + c + "' " +
						"UNION ALL " +
						"SELECT TRANSACTIONCODE, 'CHAT' FROM ks_chat " +
						_qc + " " +
						"AND CATEGORY = '" + c + "') AS tN " +
						"WHERE SER='" + _ty.split(" ")[0] + "' " +
						"GROUP BY tN.TC " +
						"ORDER BY COUNT(tN.TC) DESC;";
  con.query(qry,function(err,res) {
		if(err) cb(err);
		cb(null,res);
	})
}

module.exports.tt = function(b,e,s,g,a,t,cb) {
	let ha = function() {
		let r = "HAVING ",
			a = [];
		for(let i in sa) {
			r += "S = '" + trans[sa[i]] + "' || ";
		}
		return r.substr(0,r.length-3);
	}
	let col = [];
	let trans = {
		"checkayn": "AYN",
		"checkppde": "PPDE",
		"checkppaut": "PPAUT",
		"checkhs": "HS"
	}
	let serMC = function(v) {
		let fix = v == "TRANSACTION_CODE"? "" : "_";
		return	'CASE WHEN INSTR(' + v + ',"' + fix + 'AYN_") THEN "AYN" ' +
				'WHEN INCOMING_ADDRESS = "austria@postpay.de" THEN "PPAUT" ' +
				'WHEN INSTR(' + v + ',"' + fix + 'PP_") THEN "PPDE" ' +
				'WHEN INSTR(INCOMING_ADDRESS,"meinpaket") THEN "AYN" ' +
				'WHEN INSTR(INCOMING_ADDRESS,"allyouneed") THEN "AYN" ' +
				'ELSE "PPDE" END';
	}
	let serC = 	function(v) {
		let fix = v == "TRANSACTIONCODE"? "" : "_";
		return	'IF(INSTR(' + v + ',"' + fix + 'AYN_"),"AYN","PPDE")';
	}
	let sa = s.substr(1,s.length-2).split(",");
	let tts = t != "tt-Summe"? "tN.C," : "";
	function repl(i,oT,ty) {
		let cMC,cC,pMC,pME,pC,pE;
		if(ty==0) {
			cMC = "CATEGORY";cC = "CATEGORY";pMC = "RECEIVE_DATE";pC = "CHAT_START";pME = "";pE = "";
		} else {
			cMC = "TRANSACTION_CODE";cC = "TRANSACTIONCODE";pMC = "LAST_DATE_PROCESSED";pC = "CHAT_END";pME = "AND TRANSACTION_CODE IS NOT NULL AND TRANSACTION_CODE <> ''";pE = "AND TRANSACTIONCODE IS NOT NULL AND TRANSACTIONCODE <> ''";
		}
		let m = i == "ks-eingang" || i == "hs-reporting"? "IF(INSTR(TEMPLATE,'CALL'),'CALL','MAIL')" : "\"CHAT\"";
		let ex = i == "ks-chat"? "AND (TIME_TO_SEC(" + pC + ") BETWEEN TIME_TO_SEC('" + service_config.time_begin + "') AND TIME_TO_SEC('" + service_config.time_end + "')) AND WEEKDAY(DATE(" + pC + ")) >= " + service_config.working_days[0] + " AND WEEKDAY(DATE(" + pC + ")) < " + service_config.working_days[service_config.working_days.length-1] + " " + pE + " " : pME ;
		let ser = i == "ks-chat"? serC(cC) : serMC(cMC);
		let apl = (i == "ks-eingang" || i == "ks-chat")? (sa.indexOf("checkayn")>-1 || sa.indexOf("checkppde")>-1 || sa.indexOf("checkppaut")>-1)? true : false : (sa.indexOf("checkhs")>-1)? true : false;
		let lbl = i == "ks-chat"? cC : cMC;
		let q = "SELECT DATE(!3!) AS d," + lbl + " AS C," + ser + " AS S," + m + " AS Q FROM !1! WHERE CATEGORY IN ('!2!') AND (DATE(!3!) BETWEEN '" + b + "' AND '" + e + "') AND " + apl + " " + ex + " ";
		let d = i == "ks-chat"? pC : pMC;
		col.push(q.replace(/!1!/,i.replace(/-/,"_")).replace(/!2!/,oT.join("','")).replace(/!3!/g,d));
	}
	function qry() {
		let t = g=="year"? "year(tN.d)" : g=="day"? "CONCAT(day(tN.d),'.',month(tN.d),'.',year(tN.d))" : g=="week"? "CONCAT(week(tN.d,3),\"/\",year(tN.d))" : "CONCAT(month(tN.d),'/',year(tN.d))";
		let gran = g=="year"? "year(tN.d)" : g=="month"? "year(tN.d),month(tN.d)" : g=="week"? "year(tN.d),week(tN.d,3)" : "tN.d";
		let q = "SELECT " + t + " AS d," + tts + "COUNT(tN.C) AS CT,tN.S AS S,tN.Q AS Q FROM (!1!) AS tN GROUP BY " + gran + "," + tts + "tN.S,tN.Q " + ha() + ";";
		let c = col.length>1? col.join("UNION ALL ") : col[0];
		return q.replace(/!1!/,c);
	}
	let oT = {
		"ks-eingang":[],
		"ks-chat":[],
		"hs-reporting":[]
	}
	a.forEach(function(l) {
		let t = l.split(":");
		oT[t[1]].push(t[0]);
	})
	function __const(t) {
		for(let i in oT) {
			oT[i].length? repl(i,oT[i],t) : null;
		}
	}
	__const(0);
	con.query(qry(),function(err,res) {
		let resIn = res;
		col=[];__const(1);
		con.query(qry(),function(err,res) {
			if(err) cb(err);
			//cb(null,qry());
			cb(null,[resIn,res]);
		})
	})
}

module.exports.mv = function(b,e,n,cb) {
	function _fcol(a) {
		let _col = [];
		for(let i in a) {
			_col.push(a[i].PID);
		}
		return _col;
	}
	let qry = "SELECT PROCESS_ID AS PID FROM ks_eingang WHERE (DATE(LAST_DATE_PROCESSED) BETWEEN '" + b + "' AND '" + e + "') AND TRANSACTION_CODE IS NULL OR TRANSACTION_CODE = '' ";
	qry += "UNION ALL ";
	qry += "SELECT PROCESS_ID AS PID FROM hs_reporting WHERE (DATE(LAST_DATE_PROCESSED) BETWEEN '" + b + "' AND '" + e + "') AND TRANSACTION_CODE IS NULL OR TRANSACTION_CODE = '' ";
	con.query(qry,function(err,res) {
		if(err) cb(err);
		qry  = "SELECT tN.PID AS P,COUNT(tN.TID) AS C FROM ";
		qry += "(SELECT PROCESS_ID AS PID,TICKET_ID AS TID FROM ks_eingang ";
		qry += "UNION ALL ";
		qry += "SELECT PROCESS_ID,TICKET_ID FROM hs_reporting) AS tN ";
		qry += "WHERE tN.PID IN (!1!) ";
		qry += "GROUP BY tN.PID ";
		qry += "HAVING COUNT(tN.TID) >= " + n +" ";
		qry += "ORDER BY COUNT(tN.TID) DESC;";
		let _c = _fcol(res);
		qry = qry.replace(/!1!/,_c.join(","));
		con.query(qry,function(err,res) {
			if(err) cb(err);
			cb(null,res);
		})
	})
}

module.exports.mv_id = function(i,cb) {
	let qry  = "SELECT tN.TID,CONCAT(DAY(tN.RD),'.',MONTH(tN.RD),'.',YEAR(tN.RD)) AS RD,CONCAT(DAY(tN.LD),'.',MONTH(tN.LD),'.',YEAR(tN.LD)) AS LD,tN.C AS C,tN.T AS T FROM (";
		qry += "SELECT TICKET_ID AS TID,RECEIVE_DATE AS RD, LAST_DATE_PROCESSED AS LD,CATEGORY AS C,TRANSACTION_CODE AS T FROM ks_eingang WHERE PROCESS_ID = " + i + " ";
		qry += "UNION ALL ";
		qry += "SELECT TICKET_ID AS TID,RECEIVE_DATE AS RD, LAST_DATE_PROCESSED AS LD,CATEGORY AS C,TRANSACTION_CODE AS T FROM hs_reporting WHERE PROCESS_ID = " + i + " ";
		qry += ") AS tN";
	con.query(qry,function(err,res) {
		if(err) cb(err);
		cb(null,res);
	})
}

module.exports.kat = function(b,e,s,c,cb) {
	let sa = s.substr(1,s.length-2).split(",");
	let trans = [{
		"checkayn": "AYN",
		"checkppde": "PPDE",
		"checkppaut": "PPAUT",
		"checkhs": "HS"
	},{
		"kat-Mail": "MAIL",
		"kat-Call": "CALL",
		"kat-Chat": "CHAT",
	}]
	let ha = function(s) {
		let r = "";
		if(s) {
			for(let i in sa) {
				r += "tN.S = '" + trans[0][sa[i]] + "' || ";
			}
		} else {
			let _jp = JSON.parse(c);
			for(let i in _jp) {
				r += "tN.T = '" + trans[1][_jp[i]] + "' || ";
			}
		}
		return r.substr(0,r.length-3);
	}
	let ser = ha(!0);
	let ch = ha(!!0);
	let qry =  	"SELECT tN.C AS C,COUNT(tN.C) AS CNT FROM " + 
				"(" + 
					"SELECT CATEGORY AS C, " +
					"CASE WHEN INSTR(TRANSACTION_CODE,'AYN_') THEN 'AYN' " +
					"WHEN INCOMING_ADDRESS = 'austria@postpay.de' THEN 'PPAUT' " +
					"WHEN INSTR(TRANSACTION_CODE,'PP_') THEN 'PPDE' " +
					"WHEN INSTR(INCOMING_ADDRESS,'meinpaket') THEN 'AYN' " +
					"WHEN INSTR(INCOMING_ADDRESS,'allyouneed') THEN 'AYN' " +
					"ELSE 'PPDE' END AS S, " +
					"IF(INSTR(TEMPLATE,'CALL'),'CALL','MAIL') AS T " +
					"FROM ks_eingang " +
					"WHERE (DATE(RECEIVE_DATE) BETWEEN '" + b + "' AND '" + e + "') " +
					"UNION ALL " +
					"SELECT CATEGORY AS C,'HS' AS S, " +
					"IF(INSTR(TEMPLATE,'CALL'),'CALL','MAIL') AS T " +
					"FROM hs_reporting " +
					"WHERE (DATE(RECEIVE_DATE) BETWEEN '" + b + "' AND '" + e + "') " +
					"UNION ALL " +
					"SELECT CATEGORY AS C, " +
					"CASE WHEN INSTR(CATEGORY,'AYN_') THEN 'AYN' " +
					"ELSE 'PPDE' END AS S, " +
					"'CHAT' AS T " +
					"FROM ks_chat " +
					"WHERE (DATE(CHAT_START) BETWEEN '" + b + "' AND '" + e + "') " +
					"AND (TIME_TO_SEC(TIME(CHAT_START)) BETWEEN TIME_TO_SEC('" + service_config.time_begin + "') AND TIME_TO_SEC('" + service_config.time_end + "')) AND WEEKDAY(DATE(DATE(CHAT_START))) >= " + service_config.working_days[0] + " AND WEEKDAY(DATE(DATE(CHAT_START))) < " + service_config.working_days[service_config.working_days.length-1] + " " + 
				") AS tN " +
				"WHERE (" + ser + ") " + 
				"AND (" + ch + ") " + 
				"GROUP BY tN.C " +
				"ORDER BY COUNT(tN.C) DESC;";
	con.query(qry,function(err,res) {
		if(err) cb(err);
		cb(null,res);
	})
}

module.exports.ab = function(b,e,s,c,cb) {
	let sa = s.substr(1,s.length-2).split(",");
	let trans = [{
		"checkayn": "AYN",
		"checkppde": "PPDE",
		"checkppaut": "PPAUT",
		"checkhs": "HS"
	},{
		"kat-Mail": "MAIL",
		"kat-Call": "CALL",
		"kat-Chat": "CHAT",
	}]
	let ha = function(s) {
		let r = "";
		if(s) {
			for(let i in sa) {
				r += "tN.S = '" + trans[0][sa[i]] + "' || ";
			}
		} else {
			let _jp = JSON.parse(c);
			for(let i in _jp) {
				r += "tN.T = '" + trans[1][_jp[i]] + "' || ";
			}
		}
		return r.substr(0,r.length-3);
	}
	let ser = ha(!0);
	let ch = ha(!!0);
	let qry =  	"SELECT tN.C AS C,COUNT(tN.C) AS CNT FROM " + 
				"(" + 
					"SELECT TRANSACTION_CODE AS C, " +
					"CASE WHEN INSTR(TRANSACTION_CODE,'AYN_') THEN 'AYN' " +
					"WHEN INCOMING_ADDRESS = 'austria@postpay.de' THEN 'PPAUT' " +
					"WHEN INSTR(TRANSACTION_CODE,'PP_') THEN 'PPDE' " +
					"WHEN INSTR(INCOMING_ADDRESS,'meinpaket') THEN 'AYN' " +
					"WHEN INSTR(INCOMING_ADDRESS,'allyouneed') THEN 'AYN' " +
					"ELSE 'PPDE' END AS S, " +
					"IF(INSTR(TEMPLATE,'CALL'),'CALL','MAIL') AS T " +
					"FROM ks_eingang " +
					"WHERE (DATE(LAST_DATE_PROCESSED) BETWEEN '" + b + "' AND '" + e + "') " +
					"AND TRANSACTION_CODE <> '' AND TRANSACTION_CODE IS NOT NULL " + 
					"UNION ALL " +
					"SELECT TRANSACTION_CODE AS C,'HS' AS S, " +
					"IF(INSTR(TEMPLATE,'CALL'),'CALL','MAIL') AS T " +
					"FROM hs_reporting " +
					"WHERE (DATE(LAST_DATE_PROCESSED) BETWEEN '" + b + "' AND '" + e + "') " +
					"AND TRANSACTION_CODE <> '' AND TRANSACTION_CODE IS NOT NULL " + 
					"UNION ALL " +
					"SELECT TRANSACTIONCODE AS C, " +
					"CASE WHEN INSTR(CATEGORY,'AYN_') THEN 'AYN' " +
					"ELSE 'PPDE' END AS S, " +
					"'CHAT' AS T " +
					"FROM ks_chat " +
					"WHERE (DATE(CHAT_START) BETWEEN '" + b + "' AND '" + e + "') " +
					"AND (TIME_TO_SEC(TIME(CHAT_START)) BETWEEN TIME_TO_SEC('" + service_config.time_begin + "') AND TIME_TO_SEC('" + service_config.time_end + "')) AND WEEKDAY(DATE(DATE(CHAT_START))) >= " + service_config.working_days[0] + " AND WEEKDAY(DATE(DATE(CHAT_START))) < " + service_config.working_days[service_config.working_days.length-1] + " " + 
					"AND TRANSACTIONCODE <> '' AND TRANSACTIONCODE IS NOT NULL " + 
				") AS tN " +
				"WHERE (" + ser + ") " + 
				"AND (" + ch + ") " + 
				"GROUP BY tN.C " +
				"ORDER BY COUNT(tN.C) DESC;";
	con.query(qry,function(err,res) {
		if(err) cb(err);
		cb(null,res);
	})
}