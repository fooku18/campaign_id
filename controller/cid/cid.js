const express = require("express");
const Evt = require("events").EventEmitter;
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const model = require("../../model/cid/cid.js");
const appConfig = require("../../private/cid/config.json");
const publicData = {
	databaseConfig: appConfig.databaseConfig,
	routingConfig: appConfig.routingConfig
}
let message = new Evt();

router.get("/",function(req,res,next) {
	res.status(200).render("./cid/app",{routing:publicData});
})

router.get("/api/get/:destination",function(req,res,next) {
	let db = req.params.destination;
	let p = req.query.p;
	let r = req.query.r;
	if(db == "cid_db") {
		model.getCID(db,function(err,rows) {
			let srows = rows.slice((p-1)*r,p*r);
			res.status(200).send([srows,rows.length]);
		})
	};
	model.get(db,function(err,rows) {
		let srows = rows.slice((p-1)*r,p*r);
		res.status(200).send([srows,rows.length]);
	});
})

router.get("/api/c/:destination",function(req,res,next) {
	let db = req.params.destination;
	model.showCols(db,function(err,r) {
		if(err) console.log(err);
		res.status(200).send(r);
	})
})

router.post("/api/post/:destination",jsonParser,function(req,res,next) {
	if(!req.body) res.status(400).send();
	let db = req.params.destination;
	model.post(req.body.data.data[0],req.body.data.data[1],db, function(err,rows) {
		message.emit(db + ":update",req.body.currentPage,req.body.maxRows);
		res.status(201).send({action: "insert",status: "success"});
	});
})

router.post("/api/delete/:destination",jsonParser,function(req,res,next) {
	if(!req.body) res.status(400).send();
	let db = req.params.destination;
	model.del(req.body.data.id,db, function(err,rows) {
		message.emit(db + ":update",req.body.currentPage,req.body.maxRows);
		res.status(201).send({action: "delete",status: "success"});
	})
})

router.post("/api/update/:destination",jsonParser,function(req,res,next) {
	if(!req.body) res.status(400).send();
	let db = req.params.destination;
	model.update(req.body.data.id,req.body.data.data,db, function(err,rows) {
		message.emit(db + ":update",req.body.currentPage,req.body.maxRows);
		res.status(201).send({action: "update",status: "success"});
	})
})

router.get("/api/p/:destination",function(req,res,next) {
	let db = req.params.destination;
	let update = function(p,r) {
		model.get(db,function(err,rows) {
			if(err) res.status(401).send();
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
		if(err) res.status(401).send({action: "list input", status: "failure"});
		message.emit(db + ":update",1,10);
		res.status(201).send({action: "list input", status: "success"});
	});
})

module.exports = router;