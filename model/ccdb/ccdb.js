const mysql = require("mysql");
const mysql_config = require("../../db/mysql_config_ccdb.js");

const con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "ccdb"
})

module.exports.kq = function(b,e,g,cb) {
	let qry = "SELECT YEAR(ks_eingang.date) as year, MONTH(ks_eingang.date) as month, COUNT(ks_eingang.topic)/SUM(ayn_bestellungen.orders) as kq, " + 
			  "COUNT(ks_eingang.topic) as tickets, SUM(ayn_bestellungen.orders) as orders FROM ks_eingang INNER JOIN " + 
			  "ayn_bestellungen ON ks_eingang.date = ayn_bestellungen.date WHERE (ks_eingang.date BETWEEN '" + b + "' AND '" + e + "') " +
			  "GROUP BY YEAR(ks_eingang.date), MONTH(ks_eingang.date);";
	con.query(qry,function(err,res) {
		console.log(res);
		if(err) return cb(err);
		cb(null,res);
	})
}