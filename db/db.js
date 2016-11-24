var mysql_config = require("./mysql_config.js");
var mysql = require("mysql");
//mysql settings
var connection = mysql.createConnection(mysql_config);

exports.select = function(rows,where,table,callback) {
	if(!Array.isArray(rows)) throw "Rows must be of type Array";
	var sql = (rows[0] === "*") ? "SELECT * FROM ??" : "SELECT ?? FROM ??";
	var rq = (rows[0] === "*") ? [table] : [rows,table];
	if(where !== "") sql += " WHERE " + where;
	connection.query(sql,rq,function(err,rows) {
		if(err) throw err;
		callback(err,rows);
	})
}

exports.insert = function(rows,values,table,callback) {
	if(!Array.isArray(rows) || !Array.isArray(values)) throw "Rows and Values must be of type Array";
	var sql = "INSERT INTO ?? (??) VALUES (?)"
	connection.query(sql,[table,rows,values],function(err,rows) {
		if(err) throw err;
		callback(err,rows);
	})
}