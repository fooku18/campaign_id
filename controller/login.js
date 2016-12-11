const express = require("express");
const bodyParser = require("body-parser");
const urlParser = bodyParser.urlencoded({extended:false});
const router = express.Router();
const config = require("../private/config.json");

router.post("/auth",urlParser,function(req,res,next) {
	if(req.session.aut) next();
	if(req.body.password == config.login) {
		req.session.aut = 1;
		return res.redirect("/cid");
	};
	res.status(401).redirect("/login?aut=0");
});

router.get("/login",function(req,res,next) {
	if(req.session.aut) return res.status(302).redirect("/");
	let p = req.query["aut"];
	(p==0) 
	?locals = {
		wrongpw: true
	}
	:
	locals = {};
	res.status(200).render("login",locals);
});

router.use(function(req,res,next) {
	if(!req.session.aut) return res.status(302).redirect("login");
	next();
});

module.exports = router;