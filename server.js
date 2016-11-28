const express = require("express")
const request = require("request")
const app = express()
//express config
app.disable("x-powered-by");
app.use(express.static(__dirname + "/public"))
app.set("view engine","pug")
app.set("views","./views")
//routes
const cidController = require("./controller/cid/cid.js")
app.get("/",function(req,res) {
	res.status(200).render("index")
})
app.use("/cid",cidController);

//404
app.use(function(req,res) {
	res.status(404).render("notFound");
})
app.listen(1337,"0.0.0.0",function() {
	console.log("Server listening on 1337...")
})