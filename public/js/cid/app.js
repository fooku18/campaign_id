var app = (function(routing) {
	var app = angular.module("myApp",["pouchy.pouchDB","pouchy.cidLogic","ngRoute","pouchy.navigation","pouchy.modal","pouchy.pagination","pouchy.import_export","pouchy.multiPurpose","pouchy.worker","pouchy.model","ngAnimate"])//;
	app.run(/*["$pouchyModel",function($pouchyModel) {
		for(var i=0;i<=routing.databaseConfig.databases.length-1;i++) {
			$pouchyModel.initDatabase(routing.databaseConfig.databases[i]);
		}
	}]*/).config(["$routeProvider",function($routeProvider) {
		var exec = (function() {
			var tmp = "$routeProvider";
			for(var i=0;i<=routing.routingConfig.htmlPath.length-1;i++) {
				tmp += ".when('" + routing.routingConfig.hashTag[i] + "',{templateUrl:'" + routing.routingConfig.htmlPath[i] + "',name:'" + routing.routingConfig.pageNames[i] + "'})"
			}
			return tmp += ".otherwise({redirect:'/'});";
		}());
		eval(exec);
	}]);
	return app;
}(routing));