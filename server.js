const express = require("express");
const session = require("express-session");
const mysqlStorage = require("express-mysql-session")(session);
const request = require("request");
const mysql_config = require("./db/mysql_config.js");
const cidController = require("./controller/cid/cid.js");
const loginController = require("./controller/login.js");
const app = express();
//express config
var sessionStorage = new mysqlStorage(mysql_config.mysqlStorage_config);
app.disable("x-powered-by");
app.use(session({
	name: "CPM_session",
	resave: false,
	saveUninitialized: false,
	store: sessionStorage,
	secret: "r2d2",
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
}));
app.use(express.static(__dirname + "/public"));
app.set("view engine","pug");
app.set("views","./views");
//routes
//login
app.use(loginController);
//main
app.get("/",function(req,res) {
	res.status(200).render("index");
});

//cid
app.use("/cid",cidController);

//ccdb

//error
app.use(function(req,res) {
	res.status(404).render("notFound");
});
let port = 8080;
let ip = "0.0.0.0";
app.listen(port,ip,function() {
	console.log("Server listening on %s...",port)
});