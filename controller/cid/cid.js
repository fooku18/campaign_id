"use strict";
const express = require("express");
const jwt = require("jsonwebtoken");
const Evt = require("events").EventEmitter;
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const path = require('path');
const __dir = path.dirname(require.main.filename);
const model = require(__dir + "/model/cid/cid.js");
const config = require(__dir + "/private/config.json");
const appConfig = require(__dir + "/private/cid/config.json");
const publicData = {
	databaseConfig: appConfig.databaseConfig,
	routingConfig: appConfig.routingConfig,
	cidConfig: appConfig.cidConfig,
	analyticsConfig: appConfig.analyticsConfigPublic
};
let message = new Evt();

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
		next();
	})
})

router.get("/",function(req,res,next) {
	res.status(200).render(__dir + "/views/cid/app",{routing:publicData});
})

router.get("/api/get/:destination",function(req,res,next) {
	let db = req.params.destination;
	let p = (req.query.p) ? req.query.p : null;
	let r = (req.query.r) ? req.query.r : null;
	let q = (req.query.q) ? req.query.q : "";
	model.get(db,q,function(err,rows) {
		if(err) return console.log(err);
		let srows = (p==null) ? rows : rows.slice((p-1)*r,p*r);
		res.status(200).send([srows,rows.length]);
	});
})

router.post("/api/get/col/:destination",jsonParser,function(req,res,next) {
	let db = req.params.destination;
	let p = (req.body) ? req.body : null;
	model.countRows(db,p,function(err,rows) {
		if(err) return console.log(err);
		res.status(201).send(rows);
	})
})

router.get("/api/c/:destination",function(req,res,next) {
	let db = req.params.destination;
	model.showCols(db,function(err,r) {
		if(err) return console.log(err);
		res.status(200).send(r);
	})
})

router.post("/api/post/:destination",jsonParser,function(req,res,next) {
	if(!req.body) res.status(400).end();
	let db = req.params.destination;
	model.post(req.body.data.data[0],req.body.data.data[1],db, function(err,rows) {
		if(err) return console.log(err);
		message.emit(db + ":update",req.body.currentPage,req.body.maxRows);
		res.status(201).send({action: "insert",status: "success"});
	});
})

router.delete("/api/delete/:destination",jsonParser,function(req,res,next) {
	if(!req.body) res.status(400).send();
	let db = req.params.destination;
	model.del(req.body.data.id,db, function(err,rows) {
		if(err) return console.log(err);
		message.emit(db + ":update",req.body.currentPage,req.body.maxRows);
		res.status(201).send({action: "delete",status: "success"});
	})
})

router.put("/api/update/:destination",jsonParser,function(req,res,next) {
	if(!req.body) res.status(400).send();
	let db = req.params.destination;
	model.update(req.body.data.id,req.body.data.data,db, function(err,rows) {
		if(err) return console.log(err);
		message.emit(db + ":update",req.body.currentPage,req.body.maxRows);
		res.status(201).send({action: "update",status: "success"});
	})
})

router.get("/api/p/:destination",function(req,res,next) {
	req.setTimeout(0);
	let db = req.params.destination;
	let update = function(p,r) {
		model.get(db,"",function(err,rows) {
			if(err) return res.status(401).send();
			let srows = rows.slice((p-1)*r,p*r);
			res.status(200).send([srows,rows.length]);
		});
	};
	message.once(db + ":update",update);
	req.on("close",function() {
		message.removeListener(db + ":update",update);
	});
})

router.post("/api/u/:destination",jsonParser,function(req,res,next) {
	let db = req.params.destination;
	let data = req.body.data;
	model.insertMultiple(data,db,function(err,r) {
		if(err) return res.status(401).send({action: "list input", status: "failure"});
		message.emit(db + ":update",1,10);
		res.status(201).send({action: "list input", status: "success"});
	});
})

router.get("/api/token",function(req,res,next) {
	model.getToken(function(err,data) {
		if(err) return res.status(401).send();
		res.status(200).send({token: data});
	})
})

module.exports = router;
