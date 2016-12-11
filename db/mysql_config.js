(function() {
	var mysql_config = {
		host: "localhost",
		user: "root",
		database: "cid",
		password: "",
		dateStrings: "date"
	}
	
	var mysqlStorage_config = {
		host: "localhost",
		user: "root",
		database: "session",
		password: "",
		expiration: 1000 * 60 * 60 * 24 * 7,
		createDatabaseTable: true
	}

	module.exports = {
		mysql_config: mysql_config,
		mysqlStorage_config: mysqlStorage_config
	}
})();