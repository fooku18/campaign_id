const request = require("request");
request.post({
	url: "http://aynu.de/?login",
	form: {
		private_blog_action:"login",
		private_blog_redirect:"/",
		private_blog_password:"S1cherheitMussSein!"
	}
},function(err,res,body) {
	request({
		uri: "http://aynu.de",
		headers: {
			"cookie":res.headers["set-cookie"][0],
			"cookie":res.headers["set-cookie"][1]
		}
	},function(err,res,body) {
		console.log(body);
	})
})