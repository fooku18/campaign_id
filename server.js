var express = require("express");
var mysql = require("mysql");
var mysqlDB = require("./db/db.js");
var app = express();

//express config
app.use(express.static(__dirname + "/public"));
app.set("view engine","pug");
app.set("views","./views");

app.get("/",function(req,res,next) {
	res.status(200).render("index");
})

app.get("/get",function(req,res,next) {
	mysqlDB.select(["*"],"","campaign_db",function(err,rows) {
		res.status(200).send(rows);
	})
})

app.get("/insert",function(req,res,next) {
	mysqlDB.insert(["type","intext","start","end"],["Conversion","Extern","2016-01-01","2017-01-01"],"campaign_db",function(err,rows) {
		res.status(200).send(rows);
	})
})

app.listen(1337,function() {
	console.log("Server listening on 1337...");
})