const http = require("http");
const https = require("https");
const fs = require("fs");
const express = require("express");
const cidController = require("./controller/cid/cid.js");
const homeController = require("./controller/home.js");
const app = express();
//https credentials
var privateKey = fs.readFileSync("./private/cert/server.key","utf-8");
var certificate = fs.readFileSync("./private/cert/server.crt","utf-8");
var credentials = {
	key: privateKey,
	cert: certificate
}
//express config
app.disable("x-powered-by");
app.use(express.static(__dirname + "/public"));
app.set("view engine","pug");
app.set("views","./views");
//routes
//home
app.use("/",homeController);
//cid
app.use("/cid",cidController);
//ccdb
//error
app.use(function(req,res) {
	res.status(404).render("notFound");
});
let httpPort = 8080;
let httpsPort = 8443;
let ip = "0.0.0.0";
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials,app);
httpServer.listen(httpPort,ip);
httpsServer.listen(httpsPort,ip);
process.stdout.write("Server running HTTP on " + httpPort + ", HTTPS on " + httpsPort);