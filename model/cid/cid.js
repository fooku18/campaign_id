const mysql = require("mysql");
const mysqlDB = require("../../db/db.js");

exports.get = function(db,callback) {
	mysqlDB.select(["*"],"","","",db,callback);
}

exports.post = function(rows,vals,db,callback) {
	mysqlDB.insert(rows,vals,db,callback);
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