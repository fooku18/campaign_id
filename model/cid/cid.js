const mysql = require("mysql");
const mysqlDB = require("../../db/db.js");

exports.get = function(db,callback) {
	mysqlDB.select(["*"],"","","",db,callback);
}

exports.post = function(rows,vals,db,callback) {
	mysqlDB.insert(rows,vals,db,callback);
}

exports.del = function(id,db,callback) {
	mysqlDB.del(id,db,callback);
}

exports.update = function(id,hash,table,callback) {
	mysqlDB.update(id,hash,table,callback);
}