var express = require("express");
var router = express.Router();
var model = require("../../model/cid/cid.js");
var appConfig = require("../../private/cid/config.json");
var publicData = {
	databaseConfig: appConfig.databaseConfig,
	routingConfig: appConfig.routingConfig
}

router.get("/",function(req,res,next) {
	res.status(200).render("./cid/app",{routing:publicData});
})

router.get("/api/get",function(req,res,next) {
	model.get("campaign_db",function(err,rows) {
		res.status(200).send(rows);
	});
})

router.get("/api/insert",function(req,res,next) {
	
})

module.exports = router;