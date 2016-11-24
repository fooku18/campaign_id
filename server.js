var express = require("express");
var request = require("request");
var app = express();
//express config
app.use(express.static(__dirname + "/public"));
app.set("view engine","pug");
app.set("views","./views");
//routes
var cidController = require("./controller/cid/cid.js");
app.get("/",function(req,res) {
	res.status(200).render("index");
});
app.use("/cid",cidController);

app.listen(1337,function() {
	console.log("Server listening on 1337...");
})