const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const urlParser = bodyParser.urlencoded({extended:false});
const router = express.Router();
const config = require("../private/config.json");

function getJWT(cookie) {
	let c = cookie.split(";");
	for(let i of c) {
		if(i.indexOf("JWT") >= 0) return i.split("JWT=")[1];
	}
}

router.get("/",function(req,res,next) {
	res.status(302).redirect("/home");
})

router.get("/home",function(req,res,next) {
	res.status(200).render("index");
})

router.get("/login",function(req,res,next) {
	let q = req.query.ch;
	if(!q) {
		res.status(302).redirect("/home");
		return;
	}
	res.status(200).render("login",{ch:q});
})

router.post("/auth",urlParser,function(req,res,next) {
	if(req.body.password === config[req.body.ch]) {
		if(req.headers.cookie) {
			let token = getJWT(req.headers.cookie);
			jwt.verify(token,config.secret.join(","),function(err,decoded) {
				if(err) res.status(403).send({status: "Token mismatch"});
				if(decoded.roles) {
					decoded.roles.push(req.body.ch);
				} else {
					decoded.roles = [req.body.ch];
				}
				let nToken = jwt.sign(decoded,config.secret.join(","));
				res.cookie("JWT",nToken, {
					httpOnly: true,
					secure: true,
					maxAge: 1000*60*60*24*365
				});
				res.status(302).send({location: req.body.ch});
				return;
			})
		} else {
			let nuToken = jwt.sign({
				roles: [req.body.ch]
			},config.secret.join(","));
			res.cookie("JWT",nuToken, {
				httpOnly: true,
				secure: true,
				maxAge: 1000*60*60*24*365
			});
			res.status(302).send({location: req.body.ch});
			return;
		}
	} else {
		res.status(403).send({status: "Passwort falsch"});
		return;
	}
})

router.get("/cid",function(req,res,next) {
	if(req.headers.cookie) {
		let token = getJWT(req.headers.cookie);
		jwt.verify(token,config.secret.join(","),function(err,decoded) {
			if(decoded.roles.indexOf("cid") == -1) {
				res.status(403).redirect("/login?ch=cid");
				return
			} else
				next();
		});
	} else {
		res.status(403).redirect("/login?ch=cid");
		return;
	}
})

router.get("/ccdb",function(req,res,next) {
	if(req.headers.cookie) {
		let token = getJWT(req.headers.cookie);
		jwt.verify(token,config.secret.join(","),function(err,decoded) {
			if(decoded.roles.indexOf("ccdb") == -1) {
				res.status(403).redirect("/login?ch=ccdb");
				return
			} else
				next();
		});
	} else {
		res.status(403).redirect("/login?ch=ccdb");
		return;
	}
});

module.exports = router;