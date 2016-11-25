const mysql_config = require("./mysql_config.js");
const mysql = require("mysql");
//mysql settings
const connection = mysql.createConnection(mysql_config);

exports.select = function(rows,where,table,callback) {
	if(!Array.isArray(rows)) return console.log("Rows must be of type Array");
	var sql = (rows[0] === "*") ? "SELECT * FROM ??" : "SELECT ?? FROM ??";
	var rq = (rows[0] === "*") ? [table] : [rows,table];
	if(where !== "") sql += " WHERE " + where;
	connection.query(sql,rq,function(err,rows) {
		if(err) return console.log(err);
		callback(err,rows);
	})
}

exports.insert = function(rows,values,table,callback) {
	//if(!Array.isArray(rows) || !Array.isArray(values)) return console.log("Rows and Values must be of type Array");
	var sql = "INSERT INTO ?? (??) VALUES (?)";
	connection.query(sql,[table,rows,values],function(err,rows) {
		if(err) return console.log(err);
		callback(err,rows);
	})
}

exports.del = function(id,table,callback) {
	var sql = "DELETE FROM ?? WHERE id=?";
	connection.query(sql,[table,id],function(err,rows) {
		if(err) return console.log(err);
		callback(err,rows);
	})
}