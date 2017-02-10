const http = require("http");
const https = require("https");
const fs = require("fs");
const express = require("express");
const path = require('path');
const __dir = path.dirname(require.main.filename);
const cidController = require(__dir + "/controller/cid/cid.js");
const ccdbController = require(__dir + "/controller/ccdb/ccdb.js");
const homeController = require(__dir + "/controller/home.js");
const app = express();
//https credentials
var privateKey = fs.readFileSync(__dir + "/private/cert/server.key","utf-8");
var certificate = fs.readFileSync(__dir + "/private/cert/server.crt","utf-8");
var credentials = {
	key: privateKey,
	cert: certificate
}
//express config
app.disable("x-powered-by");
app.use(express.static(__dirname + "/public"));
app.set("view engine","pug");
app.set("views",__dir + "/views");
//routes
//home
app.use("/",homeController);
//cid
app.use("/cid",cidController);
//ccdb
app.use("/ccdb",ccdbController);
//error
app.use(function(req,res) {
	res.status(404).render("notFound");
});
//let httpPort = 8080;
let httpsPort = 8443;
let ip = "0.0.0.0";
//var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials,app);
//httpServer.listen(httpPort,ip);
httpsServer.listen(httpsPort,ip);
process.stdout.write("running...");
//process.stdout.write("Server running HTTP on " + httpPort + ", HTTPS on " + httpsPort);