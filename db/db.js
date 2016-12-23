const mysql = require("mysql");

module.exports = function(_file) {
	const connection = mysql.createConnection(_file);
	let showCols = function(table,callback) {
		connection.query("SHOW COLUMNS FROM ??",table,function(err,rows) {
			if(err) return callback(err);
			callback(null,rows);
		})
	}
	
	let countRows = function(table,where,callback) {
		function prepend(w,s) {
			s += " WHERE ";
			for(let i in w) {
				s += i + "='" + w[i] + "'";
			}
			return s;
		}
		var sql = "SELECT COUNT(*) AS c FROM " + table;
		sql = !where
		? sql
		: prepend(where,sql);
		connection.query(sql,function(err,rows) {
			if(err) return callback(err);
			callback(null,rows);
		})
	}
	
	let select = function(rows,where,limit,order,table,callback) {
		if(!Array.isArray(rows)) return console.log("Rows must be of type Array");
		var sql = (rows[0] === "*") ? "SELECT * FROM ??" : "SELECT ?? FROM ??";
		var rq = (rows[0] === "*") ? [table] : [rows,table];
		if(where !== "") sql += " WHERE " + where;
		if(limit !== "") sql += " LIMIT " + limit;
		(order === "") ? order = "DESC" :  order = "ASC";
		sql += " ORDER BY id " + order;
		connection.query(sql,rq,function(err,rows) {
			if(err) return callback(err);
			callback(null,rows);
		})
	}
	
	let insert = function(rows,values,table,callback) {
		var sql = "INSERT INTO ?? (??) VALUES (?)";
		connection.query(sql,[table,rows,values],function(err,rows) {
			if(err) return callback(err);
			callback(null,rows);
		})
	}
	
	let insertMultiple = function(rows,table,callback) {
		var sql = mysql.format("INSERT INTO ?? (??) VALUES ",[table,rows[0]]);
		for(let i = 1;i<rows.length;i++) {
			sql += "('" + rows[i].join("','") + "'),";
		}
		sql = sql.substr(0,sql.length-1);
		connection.query(sql,function(err,rows) {
			if(err) return callback(err);
			callback(null,rows);
		})
	}
	
	let del = function(id,table,callback) {
		var sql = "DELETE FROM ?? WHERE id=?";
		connection.query(sql,[table,id],function(err,rows) {
			if(err) return callback(err);
			callback(null,rows);
		})
	}
	
	let delAll = function(table,callback) {
		var sql = mysql.format("DELETE FROM ??",table);
		connection.query(sql,function(err,rows) {
			if(err) return callback(err);
			callback(null,rows);
		})
	}
	
	let update = function(id,hash,table,callback) {
		var sql = "UPDATE `" + table + "` SET ? WHERE id=" + id;
		sql = mysql.format(sql,hash);
		connection.query(sql,function(err,rows) {
			if(err) return callback(err);
			callback(null,rows);
		})
	}
	
	return {
		showCols:showCols,
		countRows:countRows,
		select:select,
		insert:insert,
		insertMultiple:insertMultiple,
		del:del,
		delAll:delAll,
		update:update
	}
}