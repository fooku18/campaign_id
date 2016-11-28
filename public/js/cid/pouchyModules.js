//
//###MultiPurpose Module###START
//
angular.module("pouchy.multiPurpose",[])
.constant("DATALAYER",(function() {
	//return JSON.parse(document.getElementById("dataConfig").textContent);
})())
.factory("$msgBusService",["$rootScope",function($rootScope) {
	var msgBus = {};
	msgBus.emit = function(msg,data) {
		$rootScope.$emit(msg,data);
	};
	msgBus.get = function(msg,scope,func) {
		var unbind = $rootScope.$on(msg,func);
		scope.$on("$destroy",unbind);
	};
	return msgBus;
}])
.factory("$hashService",function() {	
	var hash = function(val) {
		var hash = 0, i, chr, len;
		if (val.length === 0 || typeof(val) !== "string") return hash;
		for (i = 0, len = val.length; i < len; i++) {
			chr   = val.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	};
	
	return {
		hash: hash
	};
});
//
//###MultiPurpose Module###END
//

//
//###Navigation Module###START
//
angular.module("pouchy.navigation",[])
.factory("routeNavi",["$route","$location",function routeNaviFactory($route,$location) {
	var routes = [];
	angular.forEach($route.routes, function(val,key) {
		if(val.name) {
			routes.push({
				path: key,
				name: val.name
			})
		}
	});
	return {
		routes: routes
	}
}])
.controller("naviCtrl",["$scope","$location",function naviController($scope,$location) {
	$scope.isActive = function(viewLocation) {
		return viewLocation === $location.path();
	}
}])
.directive("navi",["routeNavi",function naviDirective(routeNavi) {
	return {
		restrict: "E",
		replace: true,
		templateUrl: "templates/navi_template.html",
		controller: function($scope) {
			$scope.routes = routeNavi.routes;
		}
	}
}])
.directive("sitetitle",["routeNavi","$location",function sitetitleDirective(routeNavi,$location) {
	return {
		restrict: "E",
		template: "<div class='title'><h1>{{title}}</div></h1></div>",
		replace: true,
		controller: ["$scope",function($scope) {
			$scope.$on("$locationChangeSuccess",function(e) {
				for(var i=0; i<=routeNavi.routes.length-1;i++) {
					if(routeNavi.routes[i].path === $location.path()) {
						$scope.title = routeNavi.routes[i].name;
						document.title = routeNavi.routes[i].name;
					}
				}
			});
		}]
	}
}]);
//
//###Navigation Module###END
//

//
//###Modal Module###START
//
angular.module("pouchy.modal",[])
.run(["$templateRequest",function($templateRequest) {
	$templateRequest("templates/modal/create.html");
	$templateRequest("templates/modal/delete.html");
	$templateRequest("templates/modal/fileExtensionError.html");
	$templateRequest("templates/modal/invalid.html");
	$templateRequest("templates/modal/success.html");
	$templateRequest("templates/modal/connectionError.html");
}])
.service("$modalService",["$rootScope","$q","$msgBusService",function modalService($rootScope,$q,$msgBusService) {
	var modal = {
		defer: null
	}
	
	function open(options) {
		modal.defer = $q.defer();
		$msgBusService.emit("modal:init",options);
		return modal.defer.promise;
	}
	
	function reject(data) {
		var tunnel = data || "";
		modal.defer.reject(tunnel);
	}
	
	function resolve(data) {
		var tunnel = data || "";
		modal.defer.resolve(tunnel);
	}
	
	return {
		open: open,
		resolve: resolve,
		reject: reject
	}
}])
.directive("modalOnDemand",["$rootScope","$window","$msgBusService","$modalService",function modalOnDemandDirective($rootScope,$window,$msgBusService,$modalService) {
	return {
		restrict: "E",
		scope: {},
		template: 	"<div ng-show='modalShow'>" +
						"<div class='custom-modal-overlay'></div>" +
						"<div class='custom-modal-dialog' ng-class='{\"custom-modal-stretch\":modalStretch}'>" + 
							"<div class='custom-modal-bar {{barColor}}'>&nbsp;</div>" +
							"<div class='custom-modal-icon'><span ></span></div>" +
							"<button ng-click='modalHide()' type='button' class='btn btn-default custom-modal-close' style='padding: 3px 3px;'>" +
								"<span class='glyphicon glyphicon-remove' aria-hidden='true'></span>" +
							"</button>" +
							"<div class='custom-modal-dialog-padding'>" +
								"<div class='custom-modal-dialog-content'>" +
									"<ng-include src='modalTemplate' />" +
								"</div>" + 
							"</div>" +
						"</div>" +
					"</div>",
		controller: ["$scope",function($scope) {
			this.modalHideCtrl = function() {
				$scope.modalShow = false;
				$scope.modalTemplate = "templates/modal/success.html";
			}
		}],
		link: function(scope,elem,attr) {
			scope.modalShow = null;
			scope.modalHide = function() {
				$modalService.reject();
				scope.modalShow = null;
				scope.modalTemplate = "templates/modal/success.html";
			};
			scope.confirm = function() {
				$modalService.resolve();
				scope.modalShow = null;
			};
			scope.modalTemplate = "";
			$msgBusService.get("modal:init",scope,function(event,options) {
				document.getElementsByTagName("modal-on-demand")[0].firstChild.firstChild.style.height = document.documentElement.clientHeight + "px";
				scope.values = {};
				scope.barColor = "custom-modal-bar-" + options.barColor;
				scope.modalTemplate = "templates/modal/" + options.template + ".html";
				if(options.template === "create") {
					scope.modalStretch = true;
				} else {
					scope.modalStretch = false;
				}
				scope.remote = options.remote;
				if(options.data) scope.values = options.data;
				scope.modalShow = true;
				if(document.getElementById("btn-focus-on")) {
					$window.setTimeout(function() {
						document.getElementById("btn-focus-on").focus();
					},0);
				}
			});
		}
	}
}]);
//
//###Modal Module###END
//

//
//###Pagination Module###START
//
angular.module("pouchy.pagination",[])
.directive("pagination",["$msgBusService","paginationConfig",function paginationDirective($msgBusService,paginationConfig) {
	return {
		restrict: "E",
		scope: {},
		require: "^dbTab",
		templateUrl: "templates/pagination/pagination.html",
		link: function(scope,elemt,attr,ctrlMain,transcludeFn) {
			$msgBusService.get("pagination:change",scope,function(evt,data) {
				scope.paginationArray = Array.apply(null,{length: Math.ceil(data / ctrlMain.maxRows)+1}).map(Number.call,Number).splice(1,Math.ceil(data / ctrlMain.maxRows));
			})
			scope.currentPage = ctrlMain.currentPage = 1;
			scope.changePage = function(val) {
				if(typeof(val) === "string") {
					(ctrlMain.currentPage === 1 || ctrlMain.currentPage === ctrlMain.paginationArray[-1]) ? scope.currentPage = ctrlMain.currentPage += val : scope.currentPage = ctrlMain.CurrentPage = ctrlMain.CurrentPage;
				} else {
					scope.currentPage = ctrlMain.currentPage = val;
				}
				ctrlMain.changePage(ctrlMain.currentPage);
			}
		}
	}
}])
.constant("paginationConfig",function() {
	{
		colWidth = 5
	}
})
.filter("pages",function pagesFilter() {
	return function(input,searchKey,currentPage,showRows,showFilter) {
		var regex = new RegExp(searchKey,"i");
		if(angular.isArray(input)) {
			var fitArray = [];
			for(var i=0;i<=input.length-1;i++) {
				if(regex.test(input[i].doc[showFilter])) {
					fitArray.push(input[i]);
				}
			}
			var start = (currentPage-1)*showRows;
			var end = currentPage*showRows;
			return fitArray.slice(start,end);
		}
	}
}).
filter("included",function includedFilter() {
	return function(input,searchKey,showFilter) {
		var regex = new RegExp(searchKey,"i");
		if(angular.isArray(input)) {
			var fitArray = [];
			for(var i=0;i<=input.length-1;i++) {
				if(regex.test(input[i].doc[showFilter])) {
					fitArray.push(input[i]);
				}
			}
			return fitArray.length;
		} else {
			if(input === undefined) return 0;
			return input.length;
		}
	}
});
//
//###Pagination Module###END
//

//
//###Import/Export Module###START
//
angular.module("pouchy.import_export",["pouchy.multiPurpose","pouchy.FileReader"])
.factory("exportFactory",function exportFactory() {
	/**
	 * Export File 
	 *
	 * exports current databases and data in desired format
	 *
	 * @param {string} fileName
	 * @param {object} data
	 * @return {void}
	 */
	function exportjson(fileName,data) {
		var a = document.createElement("a");
		document.body.appendChild(a);
		a.style = "display: none";
		var json = JSON.stringify(data),
		url = "data:application/json,";
		a.href = url + json;
		a.download = fileName;
		a.click();
		document.removeChild(a);
	}
	
	function exportcsv(fileName,data,track) {
		var dataStream ="",
			x;
		for(var key in data) {
			x=0;
			dataStream += "#########" + key + "#########" + "\n";
			for(var a=0;a<data[key].length;a++) {
				if((data[key][a].id).substr(0,7) === "_design") {
					x++;
				}
			}
			for(var k in data[key][x].doc) {
				dataStream += k + ";" 
			}
			dataStream += "\n";
			for(var i=x	;i<data[key].length;i++) {
				for(var k in data[key][i].doc) {
					dataStream += data[key][i].doc[k] + ";";
				}
				dataStream += "\n";
			}
		}
		var encodedStream = encodeURIComponent(dataStream);
		var a = document.createElement("a");
		document.body.appendChild(a);
		a.style = "display: none";
		url = "data:text/csv;charset=utf-8,";
		a.href = url + encodedStream;
		a.download = fileName;
		a.click();
		if(track) s.tl(a,"o","csv export");
		document.removeChild(a);
	}
	
	return {
		exportjson: exportjson,
		exportcsv: exportcsv
	}
})
.directive("downloadPop",["exportFactory","$pouchyModelDatabase",function downloadPopDirective(exportFactory,$pouchyModelDatabase) {
	var tmp = 	"<div class='importexport-wrapper relative'>" +
					"<div class='importexport-icons'>" + 
						"<span data-id='export' class='importexport lg glyphicon glyphicon-save glyphicon-30 glyphicon-a'></span>" +
						"<span data-id='import' class='importexport lg glyphicon glyphicon-open glyphicon-30 glyphicon-a'></span>" +
					"</div>" +
					"<div class='importexport-menu absolute'>" + 
						"<div class='importexport-framer'>" +
							"<h4 ng-if='import'>Import</h4>" +
							"<h4 ng-if='!import'>Export</h4>" +
							"<div class='importexport-content' ng-show='export'>" + 
								"<button class='btn btn-default importexport-btn' ng-click='getFile(\"json\")'>JSON</button>" +
								"<button class='btn btn-default importexport-btn' ng-click='getFile(\"csv\")'>CSV</button>" +
							"</div>" + 
							"<div class='importexport-content' ng-show='import'>" + 
								"<label class='btn btn-default importexport-btn' file-reader>JSON" + 
								"<input type='file' class='display-none' />" + 
								"</label>" +
								"<label class='btn btn-default importexport-btn' file-reader>CSV" + 
								"<input type='file' class='display-none' />" + 
								"</label>" +
							"</div>" + 
						"</div>" +
					"</div>" +
				"</div>";
	return {
		restrict: "A",
		scope: {},
		template: tmp,
		link: function(scope,element,attr) {
			scope.getFile = function(format) {
				var date = new Date().toISOString();
				if(format === "json") exportFactory.exportjson("export_json.json",$pouchyModelDatabase.database);
				if(format === "csv") exportFactory.exportcsv("export_csv.csv",$pouchyModelDatabase.database,true);
			};
			element.on("click",function(e) {
				if(!e.target.attributes["data-id"]) return;
				if(e.target.attributes["data-id"].value === "import") {
					scope.import = true;
					scope.export = false;
				}
				if(e.target.attributes["data-id"].value === "export") {
					scope.import = false;
					scope.export = true;
				}
				scope.$apply();
			});
			$(document).click(function(e) {
				if(e.target.className.indexOf("importexport") === -1) {
					$(element[0].querySelector(".importexport-wrapper")).removeClass("importexport-wrapper-dropdown");
				} else {
					if(!e.target.attributes["data-id"]) return;
					$(element[0].querySelector(".importexport-wrapper")).addClass("importexport-wrapper-dropdown");
				}
			});
		}
	}
}]);
//
//###Import/Export Module###END
//

//
//###FileReader Module###START
//
angular.module("pouchy.FileReader",["pouchy.import_export"])
.directive("fileReader",["$modalService",function($modalService) {
	return {
		restrict: "A",
		scope: {
			
		},
		link: function(scope,element,attr,ctrl) {
			element.on("change",function(changeEvent) {
				var file = changeEvent.target.files[0];
				var reader = new FileReader();
				reader.onload = function (loadEvent) {
					scope.$apply(function () {
						scope.ngFileModel = {
							lastModified: changeEvent.target.files[0].lastModified,
							lastModifiedDate: changeEvent.target.files[0].lastModifiedDate,
							name: changeEvent.target.files[0].name,
							size: changeEvent.target.files[0].size,
							type: changeEvent.target.files[0].type,
							data: loadEvent.target.result
						};
						console.log(scope);
					});
				}
				reader.onprogress = function(event) {
					console.log(event);
					scope.$apply();
				}
				reader.readAsText(changeEvent.target.files[0]);
			});
		}
	}
}]);
//
//###FileReader Module###END
//

//
//###PouchDB Module###START
//
angular.module("pouchy.pouchDB",[])
.controller("switchCtrl",["$scope","$msgBusService","$modalService","$pouchyModel", function switchController($scope,$msgBusService,$modalService,$pouchyModel) {
	$scope.switchChange = function() {
		($scope.switchStatus) ? $pouchyModel.startSyncing() : $pouchyModel.stopSyncing();
	}
	$scope.toggleConfig = function() {
		$scope.showConfig = !$scope.showConfig;
	}
	$msgBusService.get("remoteconnection:lost",$scope,function() {
		$scope.$apply(function() {
			$scope.switchStatus = false;
			$modalService.open({template:"connectionError",barColor:"red",remote:routing.databaseConfig.remoteUrl}).
			then(function() {
				console.log("resolved");
			},function() {
				console.log("rejected");
			});
		})
	});
}])
.directive("switch",function switchDirective() {
	var couchMode = routing.databaseConfig.dbMode === "couchDB";
	var remote = routing.databaseConfig.autoSync === true;
	
	var tmpConfig = 	"<div class='absolute slider-remote-config-dropdown'>" +
							"<div class='slider-remote-config-framer'>" +
								"<h4>Remote-Einstellungen</h4>" +
								"<div class='slider-remote-config-content'>" +
									"<div class='slider-remote-config-content-part1'>" +
										"Remote-Url: " +
									"</div>" +
									"<div class='slider-remote-config-content-part2'>" +
										"<input type='text' class='form-control' />" +
									"</div>" +
								"</div>" +
								"<div class='slider-remote-config-content'>" +
									"<div class='slider-remote-config-content-part1'>" +
										"Login: " +
									"</div>" +
									"<div class='slider-remote-config-content-part2'>" +
										"<input type='text' class='form-control' />" +
									"</div>" +
								"</div>" +
								"<div class='slider-remote-config-content'>" +
									"<div class='slider-remote-config-content-part1'>" +
										"Passwort: " +
									"</div>" +
									"<div class='slider-remote-config-content-part2'>" +
										"<input type='password' class='form-control' />" +
									"</div>" +
								"</div>" +
							"</div>" +
							"<center class='margin-bottom-15'><button class='btn btn-default'>Log-In</button></center>" +
						"</div>";
	return {
		restrict: "E",
		scope: {},
		replace: true,
		controller: "switchCtrl",
		template: 	"<div class='inline-block'>" +
						"<div class='slider-wrapper relative' ng-class={'show-config':showConfig}>" +
							"<div class='inline-block padding-left-25' ng-show='showSwitch'>" +
								"<div class='small-letters white'>Sync Mode</div>" +
								"<div>" +
									"<label class='switch'>" +
										"<input id='switcher' type='checkbox' ng-model='switchStatus' ng-click='switchChange()'>" +
										"<div class='slider round'></div>" +
									"</label>" +
								"</div>" +
							"</div>" + 
							"<div class='inline-block slider-remote-message'>" +
								"<div class='slider-remote-message-content'>" +
									"<span ng-if='switchStatus' class='slide-remote-online'>ONLINE</span>" +
									"<span ng-if='!switchStatus' class='slide-remote-offline'>OFFLINE</span>" +
								"</div>" + 
							"</div>" +
							"<div class='inline-block slider-remote-config' ng-click='toggleConfig()' ng-init='showConfig = false'>" +
								"<span class='glyphicon glyphicon-cloud glyphicon-30 glyphicon-a'></span>" +
							"</div>" +
							tmpConfig +
						"</div>" +
					"</div>",
		link: function(scope,elemt,attr) {
			(couchMode === true) ? scope.showSwitch = true : "";
			(remote === true) ? scope.switchStatus = true : scope.switchStatus = false;
		}
	}
});
//
//###PouchDB Module###END
//

//
//###PouchyModel Module###START
//
angular.module("pouchy.model",[])
//this factory serves as a model distributor for interested parties. the factory gets updated with every UI change
.factory("$pouchyModelDatabase",["$msgBusService",function pouchyModelDatabaseFactory($msgBusService) {
	function dataBaseFn(name,val) {
		database[name] = val;
	};
	var database = {};
	return {
		database: database,
		dataBaseFn: dataBaseFn
	}
}])
//restAPI
.factory("$pouchyHTTP",["$http",function pouchyRequestService($http) {
	function get(target,page,rows){
		return $http({
			method: "GET",
			url: "/cid/api/get/" + target + "?p=" + page + "&r=" + rows
		})
	}
	function post(target,data,currentPage,maxRows) {
		return $http({
			method: "POST",
			url: "/cid/api/post/" + target,
			headers: {
				"Content-Type": "application/json"
			},
			data: {
				"data": data,
				"currentPage": currentPage,
				"maxRows": maxRows
			}
		})
	}
	function del(target,data,currentPage,maxRows) {
		return $http({
			method: "POST",
			url: "/cid/api/delete/" + target,
			headers: {
				"Content-Type": "application/json"
			},
			data: {
				"data": data,
				"currentPage": currentPage,
				"maxRows": maxRows
			}
		})
	}
	function poll(target,cancel) {
		return $http({
			method: "GET",
			url: "/cid/api/p/" + target,
			timeout: cancel.promise
		})
	}
	
	return {
		get: get,
		post: post,
		poll: poll,
		del: del
	}
}])
//pouchy model is the heart of the application. it initializes the pouchdb databases on app launch and keeps the container
//up to date on any UI change. the model changes are saved in the above factory which serves as a data distributor
.service("$pouchyModel",["$q","$msgBusService","$pouchyModelDatabase",function pouchyModelService($q,$msgBusService,$pouchyModelDatabase) {
	//##############DELETE#######################
}])
.directive("dbTab",function() {
	return {
		restrict: "A",
		controller: "mainCtrl"
	}
})
//mainCtrl is initilized on every new tab - this is to prevent too much scope overhead for non relevant data as 
.controller("mainCtrl",["$scope","$pouchyWorker","$hashService","$msgBusService","$attrs","$modalService","$pouchyModel","$filter","$pouchyLoader","$pouchySAINTAPI","$pouchyHTTP","$q",function mainController($scope,$pouchyWorker,$hashService,$msgBusService,$attrs,$modalService,$pouchyModel,$filter,$pouchyLoader,$pouchySAINTAPI,$pouchyHTTP,$q) {
	//fetch database name from template attribute - this is important to seperate the data from the model service
	//config
	_t = this;
	var db = $attrs.db;
	//shared properties between directives
	_t.maxRows = 10;
	_t.currentPage;
	//shared methods between directives
	_t.changePage = function(page) {
		$scope.init.resolve();
		$scope.init = init(page);
	};
	//initialization
	function init(page) {
		$pouchyHTTP.get(db,page,_t.maxRows).then(function(res) {
			$scope.items = res.data[0];
			$msgBusService.emit("pagination:change",res.data[1]);
		},function() {
			console.log("Unable to get data from api");
		});
		var cancel = $q.defer();
		$scope.$on("$destroy",function() {
			cancel.resolve("reload");
		});
		(function poll(c) {
			$pouchyHTTP.poll(db,c).then(function(res) {
				$scope.items = res.data[0];
				$msgBusService.emit("pagination:change",res.data[1]);
				poll(c);
			},function(err) {
				if(c.promise.$$state.value = "reload") return;
				if(c.promise.$$state.status === 1) return;
				poll(c);
			})
		})(cancel)
		return cancel;
	}
	$scope.init = init(1);
	//UI input data need to be validated before pouch/couch is updated. Validation is defined on the relevant userforms
	$scope.validation = function(val,data) {
		if(val.$valid)
			$scope.addItem(val,data);
		//clean input fields from validation errors after button fired and submitted from new value input form
		if(val.$name !== "userFormChange") {
			$scope.c = {};
			$scope.userForm.$setPristine();
		}
	}
	function formatDateMYSQL(obj) {
		let RegExp = /^(0?[1-9]|[12][0-9]|3[01])\.(0?[1-9]|1[012])\.\d{4}$/;
		let arr = [[],[]];
		for(let key in obj) {
			if(RegExp.test(obj[key])) obj[key] = obj[key].substr(6,4) + "-" + obj[key].substr(3,2) + "-" + obj[key].substr(0,2);
			arr[0].push(key);
			arr[1].push(obj[key]);
		}
		return {data: arr};
	}
	//if validation succeeds UI data is beeing added
	$scope.addItem = function(val,data) {
		var dataP = formatDateMYSQL(data);
		$pouchyHTTP.post(db,dataP,_t.currentPage,_t.maxRows).then(function() {
			$modalService.open({template:"success",barColor:"green"}).
			then(function() {
				console.log("resolved");
			},function() {
				console.log("rejected");
			});
		},function() {
			$modalService.open({template:"invalid",barColor:"red"}).
			then(function() {
				console.log("resolved");
			},function() {
				console.log("rejected");
			});
		})
	}
	//UI delete data
	$scope.deleteItem = function(data) {
		$modalService.open({template:"delete",barColor:"red",data:data.info}).then(function() {
			$pouchyHTTP.del(db,data,_t.currentPage,_t.maxRows).then(function() {
				console.log(data.id + " deleted");
			}, function() {
				console.log("deletion failed");
			})
		},function() {
			console.log("Aborted");
		});
	}
	//Call the cid modal window for creating new cid or updating existing one
	$scope.cidModal = function(data) {
		//deep copy of values as we dont want to pass the reference
		var copyData = (!data) ? data : angular.copy(data);
		//send data to cidModal window for creation/update
		$modalService.open({template:"create",barColor:"white",data:copyData}).
		then(function() {
			console.log("resolved");
		},function() {
			console.log("rejected");
		});
	}
}])
.filter("dateFormatDE",function() {
	return function(val) {
		return val.substr(8,2) + "." + val.substr(5,2) + "." + val.substr(0,4);
	}
})
//bootstrapUI date picker 
.directive("datepicker",function datepickerDirective() {
	return {
		restrict: "A",
		link: function(scope,elem,attr) {
			$(elem).datepicker({
				format: "dd.mm.yyyy",
				calendarWeeks: true,
				orientation: "bottom left",
				autoclose: true,
				language: "de",
				todayHighlight: true
			});
		}
	}
})
//date validator - start date needs to be before end date otherwise the form gets invalid. 
//date validator modifies ngModel for this purpose
.directive("validateDate", function validateDateDirective() {
	return {
	   restrict: 'A',
	   require: 'ngModel',
	   link: function(scope, ele, attrs, ctrl){
			scope.$watch(attrs.ngModel,function(datesObj) {
				if(datesObj !== undefined) {
					if(datesObj["Start"] && datesObj["End"]) {
						var dayEnd = datesObj.End.substring(0,2);
						var monthEnd = datesObj.End.substring(3,5);
						var yearEnd = datesObj.End.substring(6,10);
						var dayStart = datesObj.Start.substring(0,2);
						var monthStart = datesObj.Start.substring(3,5);
						var yearStart = datesObj.Start.substring(6,10);
						if(new Date(monthStart + "/" + dayStart + "/" + yearStart) <= new Date(monthEnd + "/" + dayEnd + "/" + yearEnd)) {
							ctrl.$setValidity("wrongDatePeriod",true);
						} else {
							ctrl.$setValidity("wrongDatePeriod",false);
						}
					}
				}
			},true);
	   }
	}
})
.directive("onOffSwitch",["$pouchySAINTAPI","$pouchyModel","$pouchyLoader",function($pouchySAINTAPI,$pouchyModel,$pouchyLoader) {
	var tmp = 	"<div class='main-center relative'>" +
					"<button type='button' class='btn btn-circle btn-circle-lg btn-outline-none rotate-360' ng-class='getClass()'>" +
						"<span class='glyphicon' ng-class='getIcon()'></span>" +
					"</button>" + 
					"<div class='main-fluid-action absolute'>" +
						"<button type='button' ng-click='switchSAINT(0)' class='btn btn-circle btn-danger btn-fluid rotate-360'>" +
							"<span class='glyphicon glyphicon-remove'></span>" +
						"</button>" + 
						"<button type='button' ng-click='switchSAINT(1)' class='btn btn-circle btn-success btn-fluid rotate-360'>" +
							"<span class='glyphicon glyphicon-ok'></span>" +
						"</button>" + 
					"</div>" +
				"</div>";
	return {
		template: tmp,
		link: function(scope,element,attr) {
			(function() {
				var fn = function(el) {
					$(el).fadeToggle();
				};
				var elmt = $(element);
				var chldrn = elmt.find(".main-fluid-action").children();
				var btn = elmt.find(".btn-circle-lg").first()[0];
				elmt.first().click(function() {
					var t = 0;
					chldrn.each(function(key,val) {
						setTimeout(function() {
							fn(val);
						},t);
						t += 200;
					});
				});
			}());
			scope.getClass = function() {
				if(scope.item.doc.saintstatus) {
					return "btn-success";
				} else {
					return "btn-danger";
				}
			}
			scope.getIcon = function() {
				if(scope.item.doc.saintstatus) {
					return "glyphicon-ok";
				} else {
					return "glyphicon-remove";
				}
			}
			scope.switchSAINT = function(val) {
				/**
				*	If checkbox is unchecked we will use the SAINT API to upload our new classification dataset.
				*	The process is simply a chain of http requests as there are multiple steps necessary to url
				*	a dataset with SAINT. Before the new key can be uploaded we check the classification template
				*	and fill the columns according to the template.
				*
				*	The process is as follows:
				*
				*	Get Template -> Create Import -> Retrieve Job ID -> Populate Import -> Commit Import (Insert Job ID) -> Success/Failure
				*/
				if(!scope.item.doc.saintstatus) {
					$pouchyLoader.loaderToggle();
					var _id;
					var conf = {
						"encoding":"utf-8"
					}
					conf.rsid_list = [DATALAYER.analyticsConfig.reportSuite];
					conf.element = DATALAYER.analyticsConfig.classification_element;
					$pouchySAINTAPI.requestSAINT("Classifications.GetTemplate",conf)
					.then(function(res) {
						var s = res.data[0].template.split("\r\n");
						var sn = s[3].split("\t");
						var conf = {
							"check_divisions":"1",
							"description":"Classification Upload API",
							"export_results":"0",
							"overwrite_conflicts":"0",
						}
						conf.element = DATALAYER.analyticsConfig.classification_element;
						conf.email_address = DATALAYER.analyticsConfig.notification_email_address;
						conf.header = sn;
						conf.rsid_list = [DATALAYER.analyticsConfig.reportSuite];
						return $pouchySAINTAPI.requestSAINT("Classifications.CreateImport",conf);
					}).then(function(res) {
						if(res) {
							_id = res.data["job_id"];
							var conf = {
								"page":"1",
								"rows":[]
							}
							conf["job_id"] = _id;
							conf.rows.push({
								"row": [scope.item.doc.cid,scope.item.doc.campaign_type,scope.item.doc.creative_channel,scope.item.doc.campaign_id,
										scope.item.doc.campaign_name,scope.item.doc.campaign_start,scope.item.doc.campaign_end,scope.item.doc.placement,
										scope.item.doc.adtype,scope.item.doc.ad,DATALAYER.cidConfig.domainToken]
							});
							return $pouchySAINTAPI.requestSAINT("Classifications.PopulateImport",conf);
						}
					}).then(function(res) {
						if(res) {
							var conf = {};
							conf["job_id"] = _id;
							return $pouchySAINTAPI.requestSAINT("Classifications.CommitImport",conf);
						}
					}).then(function(res) {
						scope.item.doc.saintstatus = !scope.item.doc.saintstatus;
						return $pouchyModel.databaseContainer["cid_db"].addItem(scope.item.doc);
					}).then(function(res) {
						$pouchyLoader.loaderToggle();
						console.log(res);
					}).catch(function(err) {
						$pouchyLoader.loaderToggle();
						console.log(err);
					});
				} else {
					console.log(scope.item.doc);
				}
			}
		}
	}
}])
.factory("$pouchyLoader",function pouchyLoaderFactory() {
	return {
		loaderToggle: function() {
			$("body").toggleClass("loading");
		}
	}
})
.factory("$pouchySAINTAPI",["$http",function pouchySAINTFactory($http) {
	//WSSE is a hash library provided by Adobe
	var wsse = new Wsse();
	/**
	*	SAINT (RESTful API) implementation for Classification in Adobe Analytics
	*	@params {string} method - method to be executed from SAINT API
	*	@params {object} params - parameters to be passed to the method
	*	@return {Promise}
	*/
	function requestSAINT(method,params) {
		var x = wsse.generateAuth(DATALAYER.analyticsConfig.username,DATALAYER.analyticsConfig.secret)["X-WSSE"];
		return $http({
			method: "POST",
			url: "https://" + DATALAYER.analyticsConfig.endpoint + "/admin/1.4/rest/?method=" + method,
			headers: {
				"X-WSSE": x
			},
			data: params
		});
	}
	
	return {
		requestSAINT: requestSAINT
	}
}])
.directive("contextMenu",function($compile) {
	return {
		restrict: "A",
		controller: function($scope) {
			$scope.values = {};
			$scope.copyValue = function (value) {
				var inp,
					range,
					selection;
				inp = $("div[data-id='" + value + "']").get(0);
				range = document.createRange();
				range.selectNodeContents(inp);
				selection = window.getSelection();
				selection.removeAllRanges();
				selection.addRange(range);
				try {
					document.execCommand("copy",false,null);
				} catch(e) {
					console.log("execCommand not supported");
				}
			}
		},
		compile: function(tElement,tAttribute) {
			var html = 	"<div id='contextMenu' class='context-menu-wrapper'>" + 
							"<ul class='context-menu-framer'>" + 
								"<li class='context-menu-li' ng-repeat='(key,value) in values'>" +
									"<a class='context-menu-li-content'>" +
										"{{key}}: " + 
										"<div data-id='{{key}}' class='inline-block' ng-click='copyValue(key)'>{{value}}</div>" +
									"</a>" +
								"<li>" + 
							"</ul>" +
						"</div>";
			tElement.append(html);
			
			return {
				post: function(scope,element,attr) {
					$(element).on("contextmenu", function(e) {
						e.preventDefault();
						e.stopPropagation();
						var node = e.target;
						while(node.className.indexOf("main-table-tr") === -1) {
							node = node.parentElement;
						}
						var data = JSON.parse(node.getAttribute("data-context-info"));
						var newData = {};
						for(var key in data) {
							if(key !== "_rev" && key !== "_id") {
								newData[key] = data[key];
							}
						}
						scope.values = newData;
						scope.$apply(function() {
							var contextMenu = $("#contextMenu");
							var widthCorrection = contextMenu.width() / 2;
							element.addClass("context-menu-show");
							var O_O_top = $("#context-0-0").position().top;
							var O_O_left = $("#context-0-0").position().left;
							contextMenu.css({
								top: (e.pageY - O_O_top + 20) + "px",
								left: (e.pageX - O_O_left - widthCorrection) + "px"
							});
						});
					});
					$(document).click(function(e) {
						var target = e.target;
						if(target.className.indexOf("context-menu-li-content") === -1) {
							element.removeClass("context-menu-show");
						}
					});
				}
			}
		}
	}
});
//
//###PouchyModel Module###END
//

//
//###CID-Logic Module###START
//
angular.module("pouchy.cidLogic",[])
//this controller is more or less a copy of the main controller with slightly changes in favor of 
//different initial work and processes for cid creation
.controller("cidCtrl",["$scope","$msgBusService","$pouchyModel","$modalService","$pouchyWorker","$pouchyModelDatabase","$hashService","$pouchyCIDLogic",function cidController($scope,$msgBusService,$pouchyModel,$modalService,$pouchyWorker,$pouchyModelDatabase,$hashService,$pouchyCIDLogic) {
	$scope.intelliAdCampaigns = [];
	$scope.extCampaigns = [];
	$scope.intCampaigns = [];
	$scope.creativeChannel = [];
	//initial combobox filling for the cid create modal window
	(function() {
		//intelliAdCampaigns filling
		var fn = 	"function(doc) {" + 
						"var intellis = [];" +
						"for(var i=0;i<doc.length;i++) {" +
							"intellis.push(doc[i].doc);" +
						"}" + 
						"return intellis;" +
					"}";
		$pouchyWorker.callWorker("intelliad_db",fn).then(function(doc) {
			$scope.intelliAdCampaigns = doc;
		});
		//int/ext campaigns filling
		fn =	"function(doc) {" + 
					"var intcampaigns = [];" +
					"var extcampaigns = [];" +
					"for(var i=0;i<doc.length;i++) {" +
						"if(doc[i].doc.intext === 'Extern') {" +
							"extcampaigns.push(doc[i].doc);" +
						"} else {" +
							"intcampaigns.push(doc[i].doc);" +
						"}" +
					"}" + 
					"return [intcampaigns,extcampaigns];" +
				"}";
		$pouchyWorker.callWorker("campaign_db",fn).then(function(doc) {
			$scope.intCampaigns = doc[0];
			$scope.extCampaigns = doc[1];
		});
		//channel ID filling
		fn =	"function(doc) {" +
					"var channels = [];" +
					"for(var i=0;i<doc.length;i++) {" +
						"channels.push(doc[i].doc);" +
					"}" + 
					"return channels;" +
				"}";
		$pouchyWorker.callWorker("channelid_db",fn).then(function(doc) {
			$scope.creativeChannel = doc;
		});
	}())
	//this function serves as an wid checker and increases the number in case that 
	//some other dataset already exists with given number
	$scope.counter = function(camp,val) {
		var counter = 0;
		for(var i=0; i<$pouchyModelDatabase.database["cid_db"].length; i++) {
			if($pouchyModelDatabase.database["cid_db"][i].doc[camp] === val) counter++;
		}
		counter++
		var counterLength = counter.toString().length;
		var wid = Array(6-counterLength).join("0") + counter.toString();
		$scope.values.adid = wid;
	}
	//changes the cid UI in case of external or internal campaign
	$scope.isActive = function(val) {
		var a = (val === "Extern") ? true : false;
		return a;
	}
	$scope.intextChanger = function(data) {
		if(data === "Intern") {
			delete $scope.values.intelliad_name;
		}
	}
	$scope.validation = function(val,data) {
		if(val.$valid) {
			var data = $pouchyCIDLogic.createCID(data,$scope.intelliAdCampaigns,$scope.extCampaigns,$scope.intCampaigns,$scope.creativeChannel);
			$scope.addItem(data);
		}
	}
	$scope.addItem = function(data) {
		//if new cid then assign _id as creation data otherwise the cid gets overwritten with
		//new values from the update formular
		if(!data["_id"]) data["_id"] = new Date().toISOString();
		console.log(data);
		$pouchyModel.databaseContainer["cid_db"].addItem(data);
		$scope.hide();
	}
}])
//this factory serves as the cid generator logic. the services receives all necessary information
//about the data input and creates a unique cid and if desired an intelliad link wrapper.
.factory("$pouchyCIDLogic",["$pouchyModelDatabase","$msgBusService",function pouchyCIDLogicFactory($pouchyModelDatabase,$msgBusService) {
	function createCID(data,intelliAdCampaigns,extCampaigns,intCampaigns,creativeChannel) {
		if(data.campaign_intext === "Extern") {
			//add intelliadCamp to new Dataset
			for(var i=0;i<=intelliAdCampaigns.length-1;i++) {
				if(intelliAdCampaigns[i].name === data.intelliad_name) {
					data.intelliad_id = intelliAdCampaigns[i]._id;
					data.intelliad_root = intelliAdCampaigns[i].root;
					data.intelliad_ext = intelliAdCampaigns[i].ext;
					break;
				}
			}
			//add EXTcampaignID to new Dataset
			for(var i=0;i<=extCampaigns.length-1;i++) {
				if(extCampaigns[i].name === data.campaign_name) {
					data.campaign_id = extCampaigns[i]._id;
					data.campaign_type = extCampaigns[i].type;
					data.campaign_start = extCampaigns[i].start;
					data.campaign_end = extCampaigns[i].end;
					data.campaign_suffix = "e";
					break;
				}
			}
		} else {
			//empty rows - necessary for optimal presentation in export csv file
			data.intelliad_id = "";
			data.intelliad_root = "";
			data.intelliad_ext = "";
			//add INTcampaignID to new Dataset
			for(var i=0;i<=intCampaigns.length-1;i++) {
				if(intCampaigns[i].name === data.campaign_name) {
					data.campaign_id = intCampaigns[i]._id;
					data.campaign_type = intCampaigns[i].type;
					data.campaign_start = intCampaigns[i].start;
					data.campaign_end = intCampaigns[i].end;
					data.campaign_suffix = "i";
					break;
				}
			}
		}
		//add ChannelID to new Dataset
		for(var i=0;i<=creativeChannel.length-1;i++) {
			if(creativeChannel[i].channel === data.creative_channel) {
				data.creative_id = creativeChannel[i]._id;
				data.creative_channelid = creativeChannel[i].channelID;
			}
		}
		
		//generate CID 
		var domainToken = DATALAYER.cidConfig.domainToken;
		var organizationToken = DATALAYER.cidConfig.organizationToken;
		//if question mark does exist then add ampersand and concatenate
		var cid = data.campaign_type.charAt(0).toLowerCase() + "_" + domainToken + "_" + data.creative_channelid + data.campaign_suffix + "_" + organizationToken + "_" + data.campaign_id + "_" + data.adid + "_" + data.randomid;
		if(data.targeturl.indexOf("?") > -1) {
			var FQ = data.targeturl + "&" + cid;
		} else {
		//if no question mark in string then add ampersand + cid
			var FQ = data.targeturl + "?" + cid;
		}
		data.FQ = FQ;
		data.cid = cid;
		if(data.intelliad_id !== "") {
			data.intelliad_encoded = data.intelliad_root + encodeURIComponent(data.FQ) + data.intelliad_ext;
		} else {
			data.intelliad_encoded = "";
		}
		data.saintstatus = false;
		//time stamp of last modification
		data.modified = new Date().toISOString();
		
		return data;
	}
	
	return {
		createCID: createCID
	}
}])
.directive("cidModal",function() {
	return {
		restrict: "A",
		controller: "cidCtrl",
		require: "^^modalOnDemand",
		link: function(scope,element,attr,ctrl) {
			scope.hide = function() {
				ctrl.modalHideCtrl();
			}
		}
	}
});
//
//###CID-Logic Module###END
//

//
//###Worker Module###START
//
angular.module("pouchy.worker",["pouchy.errors"])
.service("$pouchyWorker",["$pouchyModelDatabase","$q","$pouchyError",function pouchyWorkerService($pouchyModelDatabase,$q,$pouchyError) {
	//the following two functions are necessary to transform data to arraybuffers
	//this gives us the opportunity to transfer data to the worker instead of just 
	//cloning it and then passing it over - this will give the process some boost
	//arraybuffer to string
	//
	//in order to use the worker we have to define our function as a string and name
	//the database that contains our raw data. the callWorker method wraps the task
	//into a promise and responds when finished - this enables us to use the worker 
	//response in our controller.
	//
	//    EXAMPLE USAGE:
	//---------------------------------------------------------------------------------
	//		var fn = 	"function(doc) {" + 
	//						"var id = [];" +
	//						"for(var i=0;i<doc.length;i++) {" +
	//							"id.push(doc[i].id);" +
	//						"}" + 
	//						"return id;" +
	//					"}";
	//			$pouchyWorker.callWorker("campaigns_db",fn).then(function(doc) {
	//				//proceed with result...
	//			});
	//---------------------------------------------------------------------------------
	//
	//string to arraybuffer converter - the inverse function is wrapped in the worker.js file
	//we use uft-16 charset so that we need 2bytes for each charater
	function str2ab(str) {
		var buf = new ArrayBuffer(str.length*2);
		var bufView = new Uint16Array(buf);
		for (var i=0;i<str.length;i++) {
			bufView[i] = str.charCodeAt(i);
		}
		return buf;
	}
	
	function serviceCaller(db,fn) {
		var defer = $q.defer();
		var doc;
		//if first parameter is a call to a database then assign the values to doc 
		//else take the data as an array - which is the alternative
		try {
			if(typeof(db) === "string") {
				doc = $pouchyModelDatabase.database[db];
			} else if(typeof(db) === "array") {
				doc = db;
			} else {
				throw new $pouchyError.FormatError("Only string or array accepted for worker");
			}
			var worker = new Worker("worker/datasetWorker.js");
			worker.addEventListener("message",function(e) {
				defer.resolve(e.data);
			},false);
			//var workerParameter = {doc:JSON.stringify(doc),fn:fn};
			var workerParameter = JSON.stringify(doc) + "UNIQUE_SEPERATOR" + fn;
			var ab = str2ab(workerParameter)
			worker.postMessage(ab);
				
			return defer.promise;
		}
		catch(e) {
			console.log(e.message);
		}
	}
	
	return {
		callWorker: serviceCaller
	}
}]);
//
//###Worker Module###END
//

//
//###Error Module###START
//
angular.module("pouchy.errors",[])
.factory("$pouchyError",function() {
	function FormatError(msg) {
		this.message = msg;
	}
	
	return {
		FormatError: FormatError
	}
});
//
//###Error Module###END
//