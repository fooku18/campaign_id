"use strict";
const mysql = require("mysql");
const path = require('path');
const __dir = path.dirname(require.main.filename);
const mysql_config = require(__dir + "/db/mysql_config_cid.js");
const mysqlDB = require(__dir + "/db/db.js")(mysql_config);
const wsse = require("wsse");
const appConfig = require(__dir + "/private/cid/config.json");

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
	var token = W.generateAuth(appConfig.analyticsConfig.username,appConfig.analyticsConfig.secret);
	callback(null,token);
}
