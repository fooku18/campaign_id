"use strict";
const router = require("express").Router();
const model = require("../../model/ccdb/ccdb.js");
const config = require("../../private/config.json");
const jwt = require("jsonwebtoken");

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

module.exports = router;
