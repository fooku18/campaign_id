var mysql = require("mysql");
var mysqlDB = require("../../db/db.js");

exports.get = function(db,callback) {
	mysqlDB.select(["*"],"",db,callback);
}

exports.insert = function(db) {
	mysqlDB.insert(["type","intext","start","end"],["Conversion","Extern","2016-01-01","2017-01-01"],"campaign_db",callback);
}
