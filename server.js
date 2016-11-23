var express = require("express");
var app = express();

//express config
app.use(express.static(__dirname + "/public"));
app.set("view engine","pug");
app.set("views","./views");

app.get("/",function(req,res,next) {
	res.status(200).render("index");
})

app.listen(1337,"0.0.0.0",function() {
	console.log("Server listening on 1337...");
})