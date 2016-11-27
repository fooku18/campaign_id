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
	model.get(db,function(err,rows) {
		res.status(200).send(rows);
	});
})

router.post("/api/post/:destination",jsonParser,function(req,res,next) {
	if(!req.body) res.status(400).send();
	let db = req.params.destination;
	model.post(req.body.data[0],req.body.data[1],db,function(err,rows) {
		message.emit(db + ":update");
		res.status(201).send({action: "insert",status: "success"});
	});
})

router.post("/api/delete/:destination",jsonParser,function(req,res,next) {
	if(!req.body) res.status(400).send();
	console.log(req.body);
	let db = req.params.destination;
	model.del(req.body.id,db,function(err,rows) {
		message.emit(db + ":update");
		res.status(201).send({action: "delete",status: "success"});
	})
})

router.get("/api/p/:destination",function(req,res,next) {
	let db = req.params.destination;
	let update = function() {
		model.get(db,function(err,rows) {
			res.status(200).send(rows);
		});
	}
	message.once(db + ":update",update);
	req.on("close",function() {
		message.removeListener(db + ":update",update);
	})
})

module.exports = router;