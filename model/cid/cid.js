const mysql = require("mysql");
const mysqlDB = require("../../db/db.js");
const wsse = require("wsse");
const appConfig = require("../../private/cid/config.json");

exports.get = function(db,q,callback) {
	mysqlDB.select(["*"],q,"","",db,callback);
}

exports.countRows = function(db,q,callback) {
	mysqlDB.countRows(db,q,callback);
}

exports.getCID = function(db,q,callback) {
	mysqlDB.select(["*"],q,"","",db,callback)
}

exports.post = function(rows,vals,db,callback) {
	mysqlDB.insert(rows,vals,db,callback);
}

exports.showCols = function(db,callback) {
	mysqlDB.showCols(db,callback);
}

exports.insertMultiple = function(data,db,callback) {
	let d = data;
	let _db = db;
	let cb = callback;
	mysqlDB.showCols(db,function(err,r) {
		if(r.length === data[0].length) {
			mysqlDB.delAll(_db,function(err) {
				if(err) return console.log(err);
				mysqlDB.insertMultiple(d,_db,function(err,rows) {
					if(err) return console.log(err);
					cb(err,rows);
				})
			})
		}
	});
}

exports.del = function(id,db,callback) {
	mysqlDB.del(id,db,callback);
}

exports.update = function(id,hash,table,callback) {
	mysqlDB.update(id,hash,table,callback);
}

exports.getToken = function(callback) {
	var W = new wsse();
	var token = W.generateAuth(appConfig.analyticsConfigPrivate.username,appConfig.analyticsConfigPrivate.secret);
	callback(null,token);
}