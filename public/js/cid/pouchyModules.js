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
.directive("modalOnDemand",["$rootScope","$window","$msgBusService","$modalService","$pouchyHTTP",function modalOnDemandDirective($rootScope,$window,$msgBusService,$modalService,$pouchyHTTP) {
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
		link: function(scope,elem,attr) {
			function prepare(obj) {
				var id,
					nObj = {};
				for(key in obj) {
					if(key === "id") id = obj[key]
						else nObj[key] = obj[key];
				}
				return {id:id,data:nObj};
			}

			scope.modalShow = null;
			scope.modalHide = function() {
				$modalService.reject();
				document.body.style.overflow = "";
				scope.modalShow = null;
			};
			scope.confirm = function() {
				$modalService.resolve();
				document.body.style.overflow = "";
				scope.modalShow = null;
				if(scope.options.template === "modify") {
					var p = prepare(scope.values);
					$pouchyHTTP.update(scope.options.db,p,scope.options.p,scope.options.r).then(function() {
						console.log("update successful");
					},function(err) {
						console.log("update failed");
					})
				}
			};
			scope.modalTemplate = "";
			function pM(options) {
				if(options.data) scope.values = angular.copy(options.data)
					else scope.values = {};
				scope.modalShow = true;
				if(document.getElementById("btn-focus-on")) {
					$window.setTimeout(function() {
						try{
							document.getElementById("btn-focus-on").focus();
						}
						catch(e){};
					},0);
				}
			}
			$msgBusService.get("modal:init",scope,function(event,options) {
				scope.options = options;
				document.getElementsByTagName("modal-on-demand")[0].firstChild.firstChild.style.height = document.documentElement.clientHeight + "px";
				scope.modalStretch = (options.stretch) ? true : false;
				scope.barColor = "custom-modal-bar-" + options.barColor;
				scope.modalTemplate = "templates/modal/" + options.template + ".html";
				if(/\/([^\/]*)\./.exec(scope.modalTemplate)[1] === options.template) pM(options);
				scope.$on("$includeContentLoaded",function() {
					pM(options);
				})
			});
		}
	}
}])
.filter("keyNames", function filterKeyNames() {
	var translation = {
		targeturl: "Ziel-URL",
		ad: "Werbung",
		placement: "Platzierung",
		adtype: "Werbetyp",
		adid: "Werbe-ID",
		FQ: "Vollqualifizierter Link",
		cid: "Kampagnen-ID",
		modified: "Bearbeitungsdatum",
		type: "Typ",
		intext: "Intern/Extern",
		start: "Startdatum",
		end: "Enddatum",
		name: "Titel",
		root: "Root-URL",
		ext: "Zusatz-URL",
		channel: "Kanal",
		channelID: "Kanal-ID"
	}
	return function(input) {
		for(key in translation) {
			if(input == key) return translation[key];
		}
	}
});
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
.directive("fileReader",["$pouchyHTTP","activeDB","$modalService",function($pouchyHTTP,activeDB,$modalService) {
	function* cIt(it) {
		let i = 0;
		for (let n of it) {
			yield [i,n];
			i++;
		}
	}

	function parser(data) {
		var n = data.type.substr(data.type.indexOf("/") + 1,data.type.length);
		if(n === "csv" || n === "plain" || n === "vnd.ms-excel") {
			var a = data.data.split("\r\n");
			var s = (a[0].indexOf(";")>0) ? ";" : a[0].indexOf(",")>0 ? "," : a[0].indexOf("-")>0 ? "-" : a[0].indexOf(" ")>0 ? " " : a[0].indexOf("\t")>0 ? "\t" : undefined;
			if(!s) return;
			var b = [];
			for(var i of cIt(a)) {
				(i[1] !== "") ? b[i[0]] = i[1].split(s) : null;
			}
			return b;
		}
	}

	return {
		restrict: "A",
		scope: {},
		link: function(scope,element,attr,ctrl) {
			element.on("change",function(changeEvent) {
				if(changeEvent.target.files) {
					var file = changeEvent.target.files[0];
					var reader = new FileReader();
					reader.onload = function (loadEvent) {
						var upFile = {
							lastModified: changeEvent.target.files[0].lastModified,
							lastModifiedDate: changeEvent.target.files[0].lastModifiedDate,
							name: changeEvent.target.files[0].name,
							size: changeEvent.target.files[0].size,
							type: changeEvent.target.files[0].type,
							data: loadEvent.target.result
						};
						var r = parser(upFile);
						var d = activeDB.getDB();
						$pouchyHTTP.upload(d,r).then(function(ret) {
							if(ret.data.status === "success") {
								$modalService.open({
									template: "success",
									barColor: "green"
								}).then(function() {
									console.log("resolved");
								},function() {
									console.log("rejected");
								})
							}
						});
						element[0].children[0].value = "";
					}
					reader.readAsText(changeEvent.target.files[0]);
				}
			});
		}
	}
}]);
//
//###FileReader Module###END
//


//
//###PouchyModel Module###START
//
angular.module("pouchy.model",[])
.run(function() {
	(function() {
		if("Notification" in window) {
			if(window.Notification.permisson === "granted") {
				return new Notification("Holy Owly, heute machen wir fette cid's. YEAH!",{icon:"/img/owl.jpg"});
			}
			window.Notification.requestPermission().then(function() {
				var n = new Notification("Holy Owly, heute machen wir fette cid's. YEAH!",{icon:"/img/owl.jpg"});
			})
		}
	}())
})
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
//API
.factory("$pouchyHTTP",["$http",function pouchyRequestService($http) {
	function get(target,page,rows,query){
		var url = "/cid/api/get/" + target;
		page? url += "?p=" + page + "&r=" + rows : url;
		query ? page ? url += "&q=" + query : url += "?q=" + query : null;
		return $http({
			method: "GET",
			url: url
		})
	}
	function cols(target) {
		return $http({
			method: "GET",
			url: "/cid/api/c/" + target
		})
	}
	function rowCount(target,q) {
		return $http({
			method: "POST",
			url: "/cid/api/get/col/" + target,
			headers: {
				"Content-Type": "application/json"
			},
			data: q
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
	function update(target,data,currentPage,maxRows) {
		return $http({
			method: "PUT",
			url: "/cid/api/update/" + target,
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
			method: "DELETE",
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
	function upload(target,data) {
		return $http({
			method: "PUT",
			url: "/cid/api/u/" + target,
			headers: {
				"Content-Type": "application/json"
			},
			data: {
				data: data
			}
		})
	}
	function getToken() {
		return $http({
			method: "GET",
			url: "/cid/api/token",
		})
	}

	return {
		get: get,
		post: post,
		poll: poll,
		update: update,
		upload: upload,
		cols: cols,
		rowCount: rowCount,
		del: del,
		getToken: getToken
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
.service("activeDB",function() {
	var activeDB;
	this.changeDB = function(d) {
		activeDB = d;
	}
	this.getDB = function() {
		return activeDB;
	}
})
.factory("formatMYSQL",function formatMYSQLFactory() {
	function format(obj) {
		let RegExp = /^(0?[1-9]|[12][0-9]|3[01])\.(0?[1-9]|1[012])\.\d{4}$/;
		let arr = [[],[]];
		for(let key in obj) {
			if(RegExp.test(obj[key])) obj[key] = obj[key].substr(6,4) + "-" + obj[key].substr(3,2) + "-" + obj[key].substr(0,2);
			arr[0].push(key);
			arr[1].push(obj[key]);
		}
		return {data: arr};
	}
	return {
		format: format
	}
})
//mainCtrl is initilized on every new tab - this is to prevent too much scope overhead for non relevant data as
.controller("mainCtrl",["$scope","$pouchyWorker","$hashService","$msgBusService","$attrs","$modalService","$pouchyModel","$filter","$pouchyLoader","$pouchySAINTAPI","$pouchyHTTP","$q","activeDB","dataExchange","formatMYSQL",function mainController($scope,$pouchyWorker,$hashService,$msgBusService,$attrs,$modalService,$pouchyModel,$filter,$pouchyLoader,$pouchySAINTAPI,$pouchyHTTP,$q,activeDB,dataExchange,formatMYSQL) {
	//fetch database name from template attribute - this is important to seperate the data from the model service
	//config
	_t = this;
	var db = $attrs.db;
	activeDB.changeDB(db);
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
				if(c.promise.$$state.value === "reload") return;
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
		else {
			$modalService.open({template:"invalid",barColor:"red"}).
			then(function() {
				console.log("resolved");
			},function() {
				console.log("rejected");
			});
		}
		//clean input fields from validation errors after button fired and submitted from new value input form
		if(val.$name !== "userFormChange") {
			$scope.c = {};
			$scope.userForm.$setPristine();
		}
	}
	function scrollTop(delay) {
		$("body").animate({
			scrollTop: 0
		},delay)
	}
	//if validation succeeds UI data is beeing added
	$scope.addItem = function(val,data) {
		var dataP = formatMYSQL.format(data);
		$pouchyHTTP.post(db,dataP,_t.currentPage,_t.maxRows).then(function() {
			scrollTop(400);
			$modalService.open({template:"success",barColor:"green"}).
			then(function() {
				console.log("resolved");
			},function() {
				console.log("rejected");
			});
		},function() {});
	}
	//UI delete data
	$scope.deleteItem = function(data) {
		scrollTop(400);
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
	//Call the cid modal window for updating existing datasets
	$scope.cidModal = function(data) {
		scrollTop(400);
		var template = {
			template:"modify",
			barColor:"white",
			data:data,
			db:db,
			p:_t.currentPage,
			r:_t.maxRows
		}
		if(db == "cid_db") template.stretch = 1;
		$modalService.open(template)
		.then(function() {
			console.log("resolved");
		},function() {
			console.log("rejected");
		});
	}
	function colHead(d) {
		var nd = {};
		for(i in d) {
			nd[d[i].Field] = ""
		}
		return nd
	}
	$scope.cidNew = function() {
		$pouchyHTTP.cols(db).then(function(data) {
			dataExchange.setData(colHead(data.data));
			$modalService.open({
				template: "create",
				barColor: "white"
			})
			.then(function() {
				console.log("resolved");
			},function() {
				console.log("rejected");
			});
		});
	}
}])
.factory("dataExchange",function dataExchangeFactory() {
	var data;
	function setData(d) {
		data = d;
	}
	function getData() {
		return data;
	}
	return {
		getData: getData,
		setData: setData
	}
})
.factory("cidGenerator",["$pouchyHTTP","$q",function cidGeneratorFactory($pouchyHTTP,$q) {
	function lZ(v) {
		var lzeros = 6;
		var l = v.toString().length;
		return Array(lzeros-l).join(0) + v.toString();
	}
	function generate(data) {
		var deferred = $q.defer();
		//generate CID
		eval(document.getElementById("Layer").innerHTML); // returns __routing object
		var domainToken = __routing.cidConfig.domainToken;
		var organizationToken = __routing.cidConfig.organizationToken;
		//if question mark does exist then add ampersand and concatenate
		var cid = data.campaign_intext[0].toLowerCase() + "_" + domainToken + "_" + data.channelid + data.campaign_intext[0].toLowerCase() + "_" + organizationToken + "_" + lZ(data.campaignid) + "_" + data.adid + "_" + data.randomid;
		if(data.targeturl.indexOf("?") > -1) {
			var FQ = data.targeturl + "&" + cid;
		} else {
			var FQ = data.targeturl + "?" + cid;
		}
		data.FQ = FQ;
		data.cid = cid;
		if(data.intelliadid !== "") {
			$pouchyHTTP.get("intelliad_db",null,null,"id=" + data.intelliadid).then(function(res) {
				data.FQ = res.data[0][0].root + encodeURIComponent(data.FQ) + res.data[0][0].ext;
				data.saintstatus = 0;
				data.modified = new Date().toISOString().substr(0,10);
				deferred.resolve(data);
			})
		} else {
			data.saintstatus = 0;
			data.modified = new Date().toISOString();
			deferred.resolve(data);
		}
		return deferred.promise;
	}
	return {
		generate: generate
	}
}])
.controller("cid-create",["$scope","dataExchange","$pouchyHTTP","cidGenerator","formatMYSQL","$modalService",function($scope,dataExchange,$pouchyHTTP,cidGenerator,formatMYSQL,$modalService) {
	function filterResponse(r) {
		var args = Array.prototype.slice.call(arguments,1);
		var a = [];
		var j = 0;
		for(o of r) {
			a.push({});
			for(var i=0;i<args.length;i++) {
				a[j][args[i]] = r[j][args[i]];
			}
			j++;
		}
		return a;
	}
	$scope.values = dataExchange.getData();
	$pouchyHTTP.get("channelid_db",null,null,null).then(function(data) {
		$scope.creativeChannel = filterResponse(data.data[0],"channel","id");
	});
	$scope.isActive = function(val) {
		var a = (val === "Extern") ? true : false;
		return a;
	}
	$scope.intextChanger = function(s) {
		if(s.toLowerCase() === "intern") {
			delete $scope.values.intelliad_name;
		}
		$pouchyHTTP.get("campaign_db",null,null,"intext='" + s.toLowerCase() + "'").then(function(data) {
			(s.toLowerCase() === "intern") ? $scope.intCampaigns = filterResponse(data.data[0],"name","id") : $scope.extCampaigns = filterResponse(data.data[0],"name","id");
			if(s.toLowerCase() === "extern") {
				$pouchyHTTP.get("intelliad_db",null,null,null).then(function(data) {
					$scope.intelliAdCampaigns = filterResponse(data.data[0],"name","id");
				})
			}
		})
	}
	$scope.counter = function() {
		if(!$scope.values.campaignid) return;
		$pouchyHTTP.rowCount("cid_db",{campaignid:$scope.values.campaignid}).then(function(data) {
			var modZeros = 6; //to change leading 0's length change this number
			var len = data.data[0].c.toString().length;
			var zeros = Array(modZeros - parseInt(len)).join("0");
			$scope.values.adid = zeros + (data.data[0].c + 1).toString();
		})
	}
	$scope.validation = function() {
		if($scope.userForm.$valid) {
			cidGenerator.generate($scope.values).then(function(res) {
				if(!res.id) {
					delete res.id;
					$pouchyHTTP.post("cid_db",formatMYSQL.format(res),1,10).then(function() {
						$modalService.open({template:"success",barColor:"green"}).
						then(function() {
							console.log("resolved");
						},function() {
							console.log("rejected");
						});
					});
				}

			});
		}
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
.directive("onOffSwitch",["$pouchySAINTAPI","$pouchyModel","$pouchyLoader","$pouchyHTTP",function($pouchySAINTAPI,$pouchyModel,$pouchyLoader,$pouchyHTTP) {
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
		scope: {
			item: "<"
		},
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
				if(scope.item.saintstatus) {
					return "btn-success";
				} else {
					return "btn-danger";
				}
			}
			scope.getIcon = function() {
				if(scope.item.saintstatus) {
					return "glyphicon-ok";
				} else {
					return "glyphicon-remove";
				}
			}
			scope.switchSAINTa = function (val) {
				eval(document.getElementById("Layer").innerHTML); // returns __routing object
				var conf = {
					"encoding":"utf-8"
				}
				conf.rsid_list = [__routing.analyticsConfig.reportSuite];
				conf.element = __routing.analyticsConfig.classification_element;
				$pouchySAINTAPI.requestSAINT("Classifications.GetTemplate",conf).then(function(){
					console.log(scope.item);
				});
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
				eval(document.getElementById("Layer").innerHTML); // returns __routing object
				if(!scope.item.saintstatus) {
					$pouchyLoader.loaderToggle();
					var _id,
						_camp_name,
						_camp_start,
						_camp_end,
						_channel;
					var conf = {
						"encoding":"utf-8"
					}
					conf.rsid_list = [__routing.analyticsConfig.reportSuite];
					conf.element = __routing.analyticsConfig.classification_element;
					$pouchySAINTAPI.requestSAINT("Classifications.GetTemplate",conf)
					.then(function(res) {
						var s = res.data[0].template.split("\r\n");
						var sn = s[3].split("\t");
						var conf = {
							"check_divisions":"1",
							"description":"Classification Upload API",
							"export_results":"0",
							"overwrite_conflicts":"1",
						}
						conf.element = __routing.analyticsConfig.classification_element;
						conf.email_address = __routing.analyticsConfig.notification_email_address;
						conf.header = sn;
						conf.rsid_list = [__routing.analyticsConfig.reportSuite];
						return $pouchySAINTAPI.requestSAINT("Classifications.CreateImport",conf);
					}).then(function(res) {
						_id = res.data["job_id"];
						return $pouchyHTTP.get("campaign_db",null,null,"id=" + scope.item.campaignid);
					}).then(function(res) {
						_camp_name = res.data[0][0].name;
						_camp_start = res.data[0][0].start;
						_camp_end = res.data[0][0].end;
						return $pouchyHTTP.get("channelid_db",null,null,"id=" + scope.item.channelid);
					}).then(function(res) {
						var conf = {
							"page":"1",
							"rows":[]
						}
						conf["job_id"] = _id;
						_channel = res.data[0][0].channel;
						conf.rows.push({
							"row": [scope.item.cid,scope.item.campaign_intext,_channel,scope.item.campaignid,
									_camp_name,_camp_start,_camp_end,scope.item.placement,
									scope.item.adtype,scope.item.ad,__routing.cidConfig.domainToken]
						});
						return $pouchySAINTAPI.requestSAINT("Classifications.PopulateImport",conf);
					}).then(function(res) {
						var conf = {};
						conf["job_id"] = _id;
						return $pouchySAINTAPI.requestSAINT("Classifications.CommitImport",conf);
					}).then(function(res) {
						scope.item.saintstatus = 1;
						var __id = scope.item.id;
						delete scope.item.id;
						return $pouchyHTTP.update("cid_db",{id:__id,data:scope.item},1,10);
					}).then(function(res) {
						$pouchyLoader.loaderToggle();
					}).catch(function(err) {
						$pouchyLoader.loaderToggle();
						console.log(err);
					});
				} else {
					console.log(err);
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
.factory("$pouchySAINTAPI",["$http","$pouchyHTTP",function pouchySAINTFactory($http,$pouchyHTTP) {
	/**
	*	SAINT (RESTful API) implementation for Classification in Adobe Analytics
	*	@params {string} method - method to be executed from SAINT API
	*	@params {object} params - parameters to be passed to the method
	*	@return {Promise}
	*/
	function requestSAINT(method,params) {
		eval(document.getElementById("Layer").innerHTML); // returns __routing object
		return $pouchyHTTP.getToken().then(function(res) {
			var token = res.data.token["X-WSSE"];
			return $http({
				method: "POST",
				url: "https://" + __routing.analyticsConfig.endpoint + "/admin/1.4/rest/?method=" + method,
				headers: {
					"X-WSSE": token
				},
				data: params
			});
		})
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
