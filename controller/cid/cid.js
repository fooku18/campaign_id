const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const model = require("../../model/cid/cid.js");
const appConfig = require("../../private/cid/config.json");
const publicData = {
	databaseConfig: appConfig.databaseConfig,
	routingConfig: appConfig.routingConfig
}

function obj2arr(obj) {
	let arr = [[],[]];
	for(let key in obj) {
		arr[0].push(key);
		arr[1].push(obj[key]);
	}
	return arr;
}

router.get("/",function(req,res,next) {
	res.status(200).render("./cid/app",{routing:publicData});
})

router.get("/api/get/:destination",function(req,res,next) {
	var db = req.params.destination;
	model.get(db,function(err,rows) {
		res.status(200).send(rows);
	});
})

router.post("/api/post/:destination",jsonParser,function(req,res,next) {
	if(!req.body) res.status(400).send();
	var db = req.params.destination;
	let v = obj2arr(req.body);
	model.post(v[0],v[1],db,function(err,rows) {
		res.status(201).send({action: "insert",status: "success"});
	});
})

router.post("/api/delete/:destination",jsonParser,function(req,res,next) {
	if(!req.body) res.status(400).send();
	console.log(req.body);
	var db = req.params.destination;
	model.del(req.body.id,db,function(err,rows) {
		res.status(201).send({action: "delete",status: "success"});
	})
})

module.exports = router;