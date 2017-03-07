"use strict";
const router = require("express").Router();
const model = require("../../model/ccdb/ccdb.js");
const config = require("../../private/config.json");
const bodyParser = require("body-parser");
const urlParser = bodyParser.urlencoded({extended:false});
const jwt = require("jsonwebtoken");
var dec = {};

function getJWT(cookie) {
	let c = cookie.split(";");
	for(let i of c) {
		if(i.indexOf("JWT") >= 0) return i.split("JWT=")[1];
	}
}

//check token
router.use("/",function(req,res,next) {
	let token = (req.headers.cookie)? getJWT(req.headers.cookie) : (req.headers["x-jwt-token"])? req.headers["x-jwt-token"] : null;
	if(!token) {
		res.status(403).send({status: "Access denied"});
		return;
	}
	jwt.verify(token,config.secret.join(","),function(err,decoded) {
		if(err) {
			res.status(403).send({status: "Token mismatch"});
			return;
		}
		dec = decoded;
		next();
	})
})

router.get("/",function(req,res,next) {
	res.status(200).render("./ccdb/index");
})

router.get("/api/kq",function(req,res,next) {
	if(["year","month","week","day"].indexOf(req.query.g) == -1) {
		res.status(401).send({error:"Invalid arguments"});
		return;
	}
	model.kq(req.query.b,req.query.e,req.query.g,req.query.s,function(err,data) {
		if(err) return console.log(err);
		res.status(200).send(data);
	});
})

router.get("/api/tt/init",function(req,res,next) {
	model.tt_init(req.query.b,req.query.e,req.query.s,function(err,data) {
		if(err) return console.log(err);
		res.status(200).send(data);
	})
})

router.get("/api/tt",function(req,res,next) {
	let buf = Buffer.from(req.query.tt,"base64");
	let a = buf.toString().split(",");
	model.tt(req.query.b,req.query.e,req.query.s,req.query.g,a,req.query.tts,function(err,data) {
		if(err) return console.log(err);
		res.status(200).send(data);
	})
})

router.get("/api/tt/cat",function(req,res,next) {
	let buf = Buffer.from(req.query.tt,"base64");
	let a = buf.toString().split(",");
	model.tt_cat(req.query.b,req.query.e,req.query.s,req.query.g,a,req.query.t,req.query.sn,function(err,data) {
		if(err) return res.status(400).send(err);
		res.status(200).send(data);
	})
})

router.get("/api/tt/ab",function(req,res,next) {
	model.tt_ab(req.query.t,req.query.g,req.query.ty,req.query.c,function(err,data) {
		if(err) return res.status(400).send(err)
			else res.status(200).send(data);
	})
})

router.get("/api/mv",function(req,res,next) {
	let n = req.query.n || 5;
	model.mv(req.query.b,req.query.e,n,function(err,data) {
		if(err) return res.status(400).send(err);
		res.status(200).send(data);
	})
})

router.get("/api/mv_id",function(req,res,next) {
	model.mv_id(req.query.i,function(err,data) {
		if(err) res.status(400).send("fail");
		res.status(200).send(data);
	})
})

router.get("/api/kat",function(req,res,next) {
	model.kat(req.query.b,req.query.e,req.query.s,req.query.c,function(err,data) {
		if(err) return res.status(400).send("fail") 
			else res.status(200).send(data);
	})
})

router.get("/api/ab",function(req,res,next) {
	model.ab(req.query.b,req.query.e,req.query.s,req.query.c,function(err,data) {
		if(err) return res.status(400).send("fail") 
			else res.status(200).send(data);
	})
})

router.get("/api/tk",function(req,res,next) {
	model.tk(req.query.b,req.query.e,req.query.tk,function(err,data) {
		if(err) {
			console.log(err);
			res.status(400).send(err);
			return
		}
		else res.status(200).send(data);
	})
})

router.get("/api/set",function(req,res,next) {
	function auth() {
		return "<div>" +
					"<form id='frmSet'>" + 
						"<p>Die Nutzung der Kostenkonfiguration erfordert ein Passwort</p>" + 
						"<input id='frmSetpw' type='password' class='form-control' />" + 
						"<input style='margin-top: 1px' class='btn btn-default btn-block' type='submit' value='bestätigen' />" + 
					"</form>" +
				"</div>"	
	}
	function member() {
		var _nd = new Date(),
			_t = "",
			__t = "";
		for(var i = 2016; i<=_nd.getFullYear();i++) {
			i == _nd.getFullYear()? _t += "<option selected>" + i + "</option>" : _t += "<option>" + i + "</option>";
		}
		var _b = "<div>" +
					"<form id='frmSet'>" + 
						"<h3>Monatliche Kosten je Service</h3>" + 
						"<select id='set-sel'>" + 
							_t + 
						"</select>" +
						"<div class='set_container'>" + 
							"###UNIT###" + 
						"</div>" +
						"<input id='set-con' style='margin-top: 10px' class='btn btn-default btn-block' type='submit' value='bestätigen'>" + 
					"</form>" +
				 "</div>";
		function _units() {
			var _m = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
			function _unit(i) {
				return i==0? _lbl() : _val();
				function _lbl() {
					return "<div class='set-unit'>" + 
								"<div class='set-lbl'>" + 
									"<h4>Monat</h4>" +
								"</div>" + 
								"<div class='set-val'>" + 
									"<div class='set-half'>" + 
										"<h4>Kundenservice</h4>" + 
									"</div>" + 
									"<div class='set-half'>" + 
										"<h4>Händlerservice</h4>" + 
									"</div>" + 
								"</div>" + 
								"<div class='clear'></div>" +
							"</div>";
				}
				function _val() {
					return "<div class='set-unit'>" + 
								"<div class='set-lbl'>" + 
									"<span>" + _m[i-1] + "</span>" +
								"</div>" + 
								"<div class='set-val'>" + 
									"<div class='set-half'>" + 
										"<input type='text' data-set-block data-set='ks-" + i + "' />" + 
									"</div>" + 
									"<div class='set-half'>" + 
										"<input type='text' data-set-block data-set='hs-" + i + "' />" + 
									"</div>" + 
								"</div>" + 
								"<div class='clear'></div>" +
							"</div>";
				}	
			}
			for(var i = 0;i<=12;i++) {
				__t += _unit(i);
			}
		}
		_units();
		return _b.replace(/###UNIT###/,__t);
	}
	if(dec.admin) {
		if(dec.admin.indexOf("ccdb") > -1) {
			res.status(200).send([1,member()]);
			return	
		} else {
			res.status(200).send([0,auth()]);
			return
		}
	} else {
		res.status(200).send([0,auth()]);
	}
})

router.post("/api/set",urlParser,function(req,res,next) {
	if(config.ccdb_set == req.body.password) {
		dec.admin? dec.admin.push("ccdb") : dec.admin = ["ccdb"];
		let nToken = jwt.sign(dec,config.secret.join(","));
		res.cookie("JWT",nToken, {
			httpOnly: true,
			secure: true,
			maxAge: 1000*60*60*24*365
		});
		res.status(200).send({code: 1,status: "access granted"});
	} else {
		res.status(200).send({code: 0,status: "access denied"});
	}
})

function _authChk() {
	if(!dec.admin) {
		return 0
	} else {
		if(dec.admin.indexOf("ccdb") < 0) {
			return 0
		}
		return !0
	}
}

router.get("/api/set_get",function(req,res,next) {
	if(!_authChk()) {
		res.status(403).send("unauthorized");
		return
	}
	model.set_get(req.query.y,function(err,data) {
		if(err) {
			res.status(401).send("error");
			return
		} else {
			res.status(200).send(data);
		}
	})
})

router.post("/api/set_set",bodyParser.json(),function(req,res,next) {
	if(!_authChk()) {
		res.status(403).send("unauthorized");
		return
	}
	model.set_set(req.body,function(err,data) {
		if(err) {
			res.status(401).send("error");
			return
		} else {
			res.status(200).send("OK");	
		}
	})
})

router.get("/api/set_be",function(req,res,next) {
	if(!_authChk()) {
		res.status(403).send("unauthorized");
		return
	}
	model.set_be(function(err,data) {
		if(err) {
			res.status(401).send("error");
			return
		} else {
			res.status(200).send(data);	
		}
	})
})

module.exports = router;