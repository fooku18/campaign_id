const router = require("express").Router();
const model = require("../../model/ccdb/ccdb.js");
const config = require("../../private/config.json");
const jwt = require("jsonwebtoken");

function getJWT(cookie) {
	let c = cookie.split(";");
	for(let i of c) {
		if(i.indexOf("JWT") >= 0) return i.split("JWT=")[1];
	}
}

//check token
router.use("/",function(req,res,next) {
	let token = (req.headers.cookie)? getJWT(req.headers.cookie) : (req.headers["x-jwt-token"])? req.headers["x-jwt-token"] : null;
	if(!token) {
		res.status(403).send({status: "Access denied"});
		return;
	}
	jwt.verify(token,config.secret.join(","),function(err,decoded) {
		if(err) {
			res.status(403).send({status: "Token mismatch"});
			return;
		}
		next();
	})
})

router.get("/",function(req,res,next) {
	res.status(200).render("./ccdb/index");
})

router.get("/api/kq",function(req,res,next) {
	model.kq(req.query.b,req.query.e,null,function(err,data) {
		if(err) return console.log(err);
		res.status(200).send(data);
	});
})

router.get("/api/test",function(req,res) {
	model.test(function(err,data) {
		res.status(200).send(data);
	})
})

module.exports = router;