var express = require("express");
var mysql = require("mysql");
var connection = mysql.createConnection({
	host: "localhost",
	user: "standard",
	password: "horst",
	database: "controlling"
})
var app = express();

//express config
app.use(express.static(__dirname + "/public"));
app.set("view engine","pug");
app.set("views","./views");

app.get("/",function(req,res,next) {
	connection.query("SELECT * FROM test;",function(err,rows,fields) {
		if(err) throw err;
		res.status(200).send(rows);
	})
})

app.listen(1337,"0.0.0.0",function() {
	console.log("Server listening on 1337...");
})