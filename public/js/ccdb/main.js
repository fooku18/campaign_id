var h = (function(_hC) {
	function evtClick(l,fun) {
		l.addEventListener("click",function() {
			fun();
		},false);
	}

	function evtChange(l,fun) {
		l.addEventListener("change",function() {
			fun();
		},false);
	}
	
	function evtSubmit(l,fun) {
		l.addEventListener("submit",function(e) {
			fun(e);
		},false);
	}
	/**
	*** @class _layerHandler - returns an pop-up control instance to open an close an individually defined modal
	*** @method open {int width, int height, string html-template} - opens an modal window (window.width + window.height if too large)
	**/
	function _layerHandler() {
		var _this = this;
		var _fun = function() {
			_this.close();
		}
		var _l = document.querySelector("#layer"),
			_lp = document.querySelector("#layer-pop"),
			_lc = document.querySelector(".layer-b"),
			_lX = document.querySelector("#layer-x");
		evtClick(_lX,_fun)
		function _chkDim() {
			return [window.innerWidth,window.innerHeight]
		}
		function _d(w,h) {
			var d = _chkDim();
			var _w = w > d[0]? d[0] : w;
			var	_h = h > d[1]? d[1] : h;
			return [_w,_h]
		}
		this.open = function open(w,h,t) {
			function show(l) {
				l.classList.remove("hide");
				l.classList.add("show");
			}
			var d = _d(w,h);
			_lp.style.width = d[0] + "px";_lp.style.height = d[1] + "px";
			_lc.innerHTML = t;
			!_l.classList.contains("show")? show(_l) : null;
		}
		this.close = function close() {
			function hide(l) {
				l.classList.remove("show");
				l.classList.add("hide");
			}
			_l.classList.contains("show")? hide(_l) : null;
			_lc.innerHTML = "";
		}
	}
	var _oLayerHandler = new _layerHandler();

	function Source(id,imgSrc,label,checked) {
		var ch = (!checked)? "checked" : "";
		var lbl = label || "";
		var s = document.getElementById("unit-sources");
		var div = document.createElement("DIV");
		div.classList.add("unit");
		div.classList.add("relative");
		var template = 	"<div class='unit-label absolute'>" +
							"<div class='inline-block unit-checkbox relative'>" +
								"<div id='" + id + "' class='unit-inner-checkbox absolute " + ch + "'></div>" +
							"</div>" +
							"<div class='inline-block unit-text relative' style='background-image:url(\"../../img/" + imgSrc + "\"'>" +
								"<div class='absolute' style='bottom:0;right:0;'>" +
									"<span class='maLbl madefault'>" + lbl + "</span>" +
								"</div>" +
							"</div>" +
						"</div>";
		div.innerHTML = template;
		s.appendChild(div);
		var idL = document.getElementById(id);
		idL.addEventListener("click",function() {
			o.changeStatus();
		},false);
		var o = {
			status: !checked,
			id: id,
			changeStatus: function() {
				this.status = !this.status;
				this.__listener.length? this.__listener.forEach(function(l) {l.call(l);}) : null;
				if(idL.classList.contains("checked"))
					!this.status? idL.classList.remove("checked") : null;
				else
					this.status? idL.classList.add("checked") : null;
			},
			resize: function(s) {
				div.style.width = s;
			},
			__listener: [],
			__addListener: function(fun) {
				this.__listener.push(fun);
			},
			__removeListener: function() {
				this.__listener = [];
			}
		};
		return o;
	}

	function bootGranularity() {
		var _ids = [];
		function collector(_ia) {
			_ia.forEach(function(l) {
				_ids.push(document.getElementById(l));
			})
		}
		collector(["gran-day","gran-kw","gran-month","gran-year"]);
		_ids[2].classList.add("checked");
		var o = {
			__gran: "gran-month",
			__changeGran: function(v) {
				this.__gran = v;
				fun(v);
			}
		}
		var fun = function(n) {
			var l = document.getElementById(n);
			var __ids = _ids;
			if(l.classList.contains("checked")) return;
			__ids.forEach(function(m) {
				if(m.id == l.id) {
					m.classList.add("checked");
				} else {
					if(m.classList.contains("checked")) m.classList.remove("checked");
				}
			})
		}
		_ids.forEach(function(l) {
			evtClick(l,function() {o.__changeGran(l.id)});
		})
		return o;
	}

	function bootDate() {
		var toMysql = function(d) {
			var t = d.substr(0,2);
			var m = d.substr(3,2);
			var y = d.substr(6,4);
			return y + "-" + m + "-" + t;
		}
		var b = document.getElementsByClassName("chart-calendar-elements")[0];bD=toMysql(b.value);
		var e = document.getElementsByClassName("chart-calendar-elements")[1];eD=toMysql(e.value);
		var ar = [b,e];
		var o = {
			__b: bD,
			__e: eD,
			__change: function(v,i) {
				i=="cal-b"? this.__b = v : this.__e = v;
				this.__listener.length? this.__listener.forEach(function(l){l.call(l);}) : null;
			},
			__change_init: function(v) {
				$(ar[0]).datepicker("setDate",new Date(v));
			},
			__listener: [],
			__addListener: function(l) {
				this.__listener.push(l);
			},
			__clearListener: function() {
				this.__listener = [];
			}
		}
		for(var i=0;i<ar.length;i++) {
			$(ar[i]).datepicker({
				format: "dd.mm.yyyy",
				calendarWeeks: true,
				orientation: "bottom right",
				autoclose: true,
				language: "de",
				todayHighlight: true
			})
			.on("changeDate",function(e) {
				o.__change(toMysql(this.value),this.id);
			});
			if(i==0) {
				var d = new Date();
				var y = d.getFullYear();
				var nd = new Date(y,0,1);
				$(ar[i]).datepicker("setDate",nd);
			} else {
				var nd = new Date();
				$(ar[i]).datepicker("setDate",nd);
			}
		}
		return o;
	}

	function bootMode(http,g) {
		var dB = document.getElementById("unit-dynamic");
		function cleardB() {
			dB.innerHTML = "";
		}
		function __init() {
			cleardB();
			g.__d.__clearListener();
			for(var x in g.__src) {g.__src[x].__removeListener();}
		}
		function replacer(match,offset,string) {
			var l = {
				"&#246;": "ö",
				"&#228;": "ä",
				"&#252;": "ü"
			}
			return l[match];
		}
		function unitPlus(w,gr,t,ch) {
			var lbl = gr + "-" + t,
				c;
			c = lbl == g.__tt? "checked" : "";
			ch? c = "checked" : "";
			return "<div class='unit unit-gran relative idontwantnobordabelow' style='width:" + w + "%;'>" +
						"<div class='unit-label absolute'>" +
							"<div class='inline-block unit-checkbox-gran relative'>" +
								"<div class='unit-inner-checkbox absolute " + c + "' id='" + gr + "-" + t + "'></div>" +
							"</div>" +
							"<div class='inline-block unit-text-gran relative'>" +
								"<span>" + t + "</span>" +
							"</div>" +
						"</div>" +
					"</div>";
		}
		return {
			__mode: "kq",
			__changeMode: function(v) {
				function _initBuilder(a,t) {
					function _init() {
						function _col() {
							var _a = [];
							kA.forEach(function(l) {
								l.classList.contains("checked")? _a.push(l.id) : null;	
							})
							return _a
						}
						var kA = a.map(function(l) {
							return document.getElementById(t + "-" + l)	
						});
						var fun = function() {
							function _plaus(_this) {
								var _b = 0;
								kA.forEach(function(l) {
									if(l != _this) {
										if(l.classList.contains("checked")) _b++;
									}
								})
								return _b;
							}
							if(this.classList.contains("checked")) {
								if(!_plaus(this)) return;
							}
							this.classList.contains("checked")? this.classList.remove("checked") : this.classList.add("checked");
							g["__" + t] = _col();
						}
						kA.forEach(function(l) {
							evtClick(l,fun.bind(l));
						})
						g["__" + t] = _col();
					}
					var _t = "<div id='" + t + "-gran' class='unit-granularity'>" +
								"###UNITS###" + 
							"</div>",
						_u = "",
						_l = parseFloat(parseFloat(100/a.length).toFixed(2));
					a.forEach(function(l) {
						_u += unitPlus(_l,t,l,!0);
					})
					dB.innerHTML = _t.replace(/###UNITS###/,_u);
					_init();
				}
				var __mBox = document.getElementById("chart-menu-content");
				__mBox.classList.contains("expander")? null : __mBox.classList.add("expander");
				_this = this;
				_this.__mode = v;
				g.__tt = !g.__tt? "tt-Summe" : g.__tt;
				switch(v) {
					case "tt": 
						__init();
						var dyn = function(v) {
							var dO = document.createElement("div");dO.classList.add("unit-themen-content");
							var di = document.createElement("div");di.classList.add("unit-themen-label");
							var l = document.createElement("label");l.classList.add("normal-label");l.textContent = (v.C).replace(/&#246;|&#228;|&#252;/g,replacer);
							var dii = document.createElement("div");dii.classList.add("unit-themen-content-box");
							var i = document.createElement("input");i.setAttribute("type","checkbox");i.setAttribute("name",v.C + ":" + v.S);i.checked = 1;
							di.appendChild(l);dii.appendChild(i);dO.appendChild(di);dO.appendChild(dii);
							ol[v.S].appendChild(dO);
						}
						function listener(l) {
							l.addEventListener("click",function() {
								function s(l) {
									l.classList.contains("unit-themen-show")? null : l.classList.add("unit-themen-show");
									l.classList.contains("unit-themen-hide")? l.classList.remove("unit-themen-hide") : null;
								}
								function h(l) {
									l.classList.contains("unit-themen-hide")? null : l.classList.add("unit-themen-hide");
									l.classList.contains("unit-themen-show")? l.classList.remove("unit-themen-show") : null;
								}
								var fC = document.forms["appForm"].children;
								for(var i=0;i<fC.length;i++) {
									fC[i].id==l.dataset.lbl? s(fC[i]) : h(fC[i]);
								}
							}.bind(l),false)
						}
						var tmp = 	"<div class='unit-themen'>" +
										"<div class='unit-themen-riders'>" +
											"<div id='rider-ks-eingang' data-lbl='unit-themen-ks-eingang' class='unit-themen-rider macurs'>KS Eingang</div>" +
											"<div id='rider-ks-chat' data-lbl='unit-themen-ks-chat' class='unit-themen-rider macurs'>KS Chat</div>" +
											"<div id='rider-hs-reporting' data-lbl='unit-themen-hs-reporting' class='unit-themen-rider macurs'>HS Reporting</div>" +
										"</div>" +
										"<div class='clear'></div>" +
										"<form name='appForm'>" +
											"<div id='unit-themen-ks-eingang' class='unit-themen-container unit-themen-show'></div>" +
											"<div id='unit-themen-ks-chat' class='unit-themen-container unit-themen-hide'></div>" +
											"<div id='unit-themen-hs-reporting' class='unit-themen-container unit-themen-hide'></div>" +
										"</form>" +
										"<div class='clear'></div>" +
									"</div>" +
									"<div id='tt-gran' class='unit-granularity'>" +
										unitPlus(50,"tt","Einzel") + unitPlus(50,"tt","Summe") +
									"</div>";
						dB.innerHTML = tmp;
						(function() {
							var _tt = document.getElementById("tt-gran");
							var _e = document.getElementById("tt-Einzel");
							var _g = document.getElementById("tt-Summe");
							var _ttC = function(_t) {
								if(_t.classList.contains("checked")) {
									return;
								} else {
									if(_t.id == "tt-Summe") {
										_e.classList.remove("checked");_g.classList.add("checked");g.__tt = "tt-Summe";
									} else {
										_e.classList.add("checked");_g.classList.remove("checked");g.__tt = "tt-Einzel";
									}
								}
							}
							var _ttFun = function(e) {
								e.target.id? e.target.id == "tt-Einzel" || e.target.id == "tt-Summe"? _ttC(e.target) : null : null;
							}.bind(_tt)
							_tt.addEventListener("click",_ttFun);
						}())
						var ol = {
							"ks-eingang": document.getElementById("unit-themen-ks-eingang"),
							"ks-chat": document.getElementById("unit-themen-ks-chat"),
							"hs-reporting": document.getElementById("unit-themen-hs-reporting")
						}
						listener(document.getElementById("rider-ks-eingang"));listener(document.getElementById("rider-ks-chat"));listener(document.getElementById("rider-hs-reporting"));
						var fun = function() {
							var _g = this.interpret();
							for(var i in ol) {ol[i].innerHTML = "";}
							http("/ccdb/api/tt/init?b=" + this.__d.__b + "&e=" + this.__d.__e + "&s=[" + _g[1].toString() + "]").then(function(data) {
								var da = JSON.parse(data);
								dyn({C:"Alle",S:"ks-eingang"});dyn({C:"Alle",S:"ks-chat"});dyn({C:"Alle",S:"hs-reporting"});
								for(var i in da) {
									dyn(da[i]);
								}
							})
						}.bind(g);fun();
						var funL = function(e) {
							var _this = this;
							function c(c,t) {
								for(var i=0;i<_this.length;i++) {
									_this[i].name.match(t)? c? _this[i].checked = 1 : _this[i].checked = !1 : null;
								}
							}
							e.target.name? e.target.name.match(/Alle:.*/)? e.target.checked? c(1,e.target.name.split(":")[1]) : c(!1,e.target.name.split(":")[1]) : null : null;
						}
						document.forms["appForm"].addEventListener("click",funL.bind(document.forms["appForm"]));
						g.__d.__addListener(fun);
						for(var x in g.__src) {g.__src[x].__addListener(fun);}
						break;
					case "mv": 
						__init();
						break;
					case "ab":
					case "kat": 
						__init();
						_initBuilder(["Mail","Call","Chat"],"kat");
						break;
					case "tk": 
						__init();
						_initBuilder(["KS","HS","Beschwerde"],"tk");
						break;
					//add new cases for side-menu manipulation
					//default just restores the initial menu
					default: 
						__init();
						break;
				}
			}
		}
	}

	function addListeners(__g) {
		/**
		***	initial block for setting UI events
		**/
		// Method Menu Events
		var mCont = Array.prototype.slice.call(document.querySelectorAll(".mContainer li>a"),0);
		var fun = function(a) {__g.__m.__changeMode(a.id)};
		mCont.forEach(function(l) {
			evtClick(l,function() {fun(l)});
		})
		var menuBtn = document.getElementById("menu-btn");
		var menu = document.getElementById("menu");
		menuBtn.addEventListener("click",function() {
			if(menu.classList.contains("menu-down")) {
				menu.classList.remove("menu-down");
				menu.classList.add("menu-up");
			} else {
				menu.classList.remove("menu-up");
				menu.classList.add("menu-down");
			}
		},false);
		// Menu Expander Events
		var chartMenuBtn = document.getElementById("chart-menu-symbol");
		var chartMenuContent = document.getElementById("chart-menu-content");
		chartMenuBtn.addEventListener("click",function() {
			if(chartMenuContent.classList.contains("expander")) {
				chartMenuContent.classList.remove("expander");
			} else {
				chartMenuContent.classList.add("expander");
			}
		},false);
		// Save Button and Setting Button Events
		var prefSave = document.getElementById("pref-btn"),
			prefSet = document.querySelector("#pref-set");
		evtClick(prefSave,function() {
			__g.writeCookie();
		})
		evtClick(prefSet,function() {
			var _fun = function(e) {
				e.preventDefault();
				http("/ccdb/api/set","password=" + document.getElementById("frmSetpw").value,!0).then(function(res) {
					if(res.code == 0) {
						document.querySelector("#frmSetpw").style.borderColor = "rgba(255,0,0,.5)";
					} else {
						__fun()
					}
				})
			}
			var __fun = function() {
				http("/ccdb/api/set").then(function(res) {
					var _rP = JSON.parse(res);
					if(_rP[0] == 0) {
						_oLayerHandler.open(400,160,_rP[1]);
						var _f = document.querySelector("#frmSet");
						evtSubmit(_f,_fun);
					} else {
						function _fill(res) {
							var _p = JSON.parse(res);
							!function _clear() {
								_e.forEach(function(l) {
									l.value = "0";
								})
							}()
							_p.forEach(function(l) {
								var _f = l.service + "-" + l.monat;
								document.querySelector("[data-set=" + _f + "]").value = l.kosten.toString();
							})
						}
						_oLayerHandler.open(400,600,_rP[1]);
						var _e = Array.prototype.slice.call(document.querySelectorAll("[data-set-block]"),0);
						//Handler
						!function() {
							var _funSel = function() {
								http("ccdb/api/set_get?y=" + document.querySelector("#set-sel").value).then(function(res) {
									!res.length? null : _fill(res);
								})
							};
							var _funCon = function(e) {
								e.preventDefault();
								!function _col() {
									var _y = document.querySelector("#set-sel").value,
										_o = Object.assign({});_o._a = [];
									_e.forEach(function(l) {
										_o._a.push({"jahr":_y,"monat":l.getAttribute("data-set").split("-")[1],"kosten":l.value,"service":l.getAttribute("data-set").split("-")[0]});
									})
									http("/ccdb/api/set_set",_o,1,1).then(function(data) {
										console.log(data);	
									})
								}()
							}
							evtChange(document.querySelector("#set-sel"),_funSel);
							evtSubmit(document.querySelector("#frmSet"),_funCon);
						}()
						http("ccdb/api/set_get?y=" + document.querySelector("#set-sel").value).then(function(res) {
							!res.length? null : _fill(res);
						})
					}
				})
			}
			__fun();
		})
	}

	function addGlobalObject() {
		var __g = {
			__src: [],
			__gran: {},
			__d: {}
		}
		__g.interpret = function() {
			var gran = {
				"gran-day": "day",
				"gran-month": "month",
				"gran-year": "year",
				"gran-kw": "week"
			}
			var s = [];
			this.__src.forEach(function(l) {
				if(l.status) s.push(l.id);
			})
			var _tt = this.__tt? this.__tt : null;
			var _kat = this.__kat? this.__kat : null;
			var _tk = this.__tk? this.__tk : null;
			return [gran[this.__gran.__gran],s,{b:this.__d.__b,e:this.__d.__e},_tt,_kat,_tk]
		}
		__g.writeCookie = function() {
			document.cookie = "settings=" + btoa(JSON.stringify(this)) + ";max-age=" + 60*60*24*90;
		}
		__g.parseCookie = function() {
			var c = JSON.parse(atob(document.cookie.split("settings=")[1]));
			for(var i in this.__src) {c.__src[i].status != this.__src[i].status? this.__src[i].changeStatus() : null;}
			this.__gran.__changeGran(c.__gran.__gran);
			this.__d.__change_init(c.__d.__b);
		}
		return __g;
	}

	document.addEventListener("DOMContentLoaded",function() {
		//initial screendim check
		var chartSection = document.getElementsByClassName("chart-section")[0];
		var banner = document.getElementsByClassName("banner")[0];
		if(document.body.clientHeight < 800) banner.style.height = "170px";
		chartSection.style.height = (document.body.clientHeight - chartSection.getBoundingClientRect().top) + "px";
		//modelBoot
		(function() {
			//init global object
			var __g = addGlobalObject();
			addListeners(__g);
			function resize(a) {
				var le = (100/a.length);
				a.forEach(function(l) {
					l.resize(le + "%");
				})
			}
			//call chart
			var btnApply = document.getElementById("btn-apply");
			btnApply.addEventListener("click",function() {
				__c["__" + __c.__g.__m.__mode].call(__c);
			},false);
			//set service sources
			var s1 = Source("checkayn","ayn.png");
			var s2 = Source("checkppde","pp.png","GER");
			var s3 = Source("checkppaut","pp.png","AUT");
			var s4 = Source("checkhs","ds.png",null,1);
			resize([s1,s2,s3,s4]);
			__g.__src = [s1,s2,s3,s4];
			__g.__gran = bootGranularity();
			__g.__d = bootDate();
			__g.__m = bootMode(http,__g);

			//check if cookie is set
			document.cookie? __g.parseCookie() : null;
			//boot Highcharts and set global config
			var __c = highchartsBoot();
			__c.__clear = function clearChart() {
				while(this.series.length) {
					this.series[0].remove();
				}
				while(this.yAxis[1]) {
					this.yAxis[1].remove();
				}
			}
			//bind __g to chart
			__c.__g = __g;
			__c.__kq = kq;
			__c.__tt = tt;
			__c.__mv = mv;
			__c.__kat = kat;
			__c.__ab = ab;
			__c.__tk = tk;
			//initial call
			__c["__" + __c.__g.__m.__mode].call(__c);
			console.log(__c);
		}())
	},false);

	//layer
	function __layer() {
		function replacer(match,offset,string) {
			var l = {
				"&#246;": "ö",
				"&#228;": "ä",
				"&#252;": "ü"
			}
			return l[match];
		}
		var _add = function(_vID) {
			http("/ccdb/api/mv_id?i=" + _vID).then(function(res) {
				var _t = document.createElement("table"),
					_tr = document.createElement("tr");
				_tr.innerHTML = "<th>ID</th><th>Eingang</th><th>Abschluss</th><th>Kategorie</th><th>AB-Code</th>";
				_t.classList.add("table","table-striped","table-hover");
				_t.appendChild(_tr);
				var r = JSON.parse(res);
				for(var i in r) {
					var _tr = document.createElement("tr");
					var _tdI = document.createElement("td");_tdI.textContent = r[i].TID;
					var _tdR = document.createElement("td");_tdR.textContent = r[i].RD;
					var _tdL = document.createElement("td");_tdL.textContent = r[i].LD;
					var _tdC = document.createElement("td");_tdC.textContent = (r[i].C).replace(/&#246;|&#228;|&#252;/g,replacer);
					var _tdT = document.createElement("td");_tdT.textContent = (r[i].T).replace(/&#246;|&#228;|&#252;/g,replacer);
					_tr.appendChild(_tdI);_tr.appendChild(_tdR);_tr.appendChild(_tdL);_tr.appendChild(_tdC);_tr.appendChild(_tdT);
					_t.appendChild(_tr);
				}
				_oLayerHandler.open(850,600,_t.outerHTML);
			})
		}
		return {
			exec: function(vID) {
				_add(vID);
			}
		}
	}

	/** REST CALLS
	*** @params {string src} - Target Source {string params} - Parameters to include {int post} - 1 if post 0 if get {int json} - 1 if json 0 if not
	*** @return {promise}
	**/
	function http(src,params,post,json) {
		var p = params || null;
		var deferred = new Promise(function(resolve,reject) {
			var xhr = new XMLHttpRequest();
			!post? xhr.open("GET",src,true) : xhr.open("POST",src,true);
			post? json? xhr.setRequestHeader("Content-Type","application/json") : xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded") : null;
			xhr.onreadystatechange = function() {
				if(xhr.readyState == 4 && xhr.status == 200) {
					resolve(xhr.responseText);
				}
				if(xhr.status != 200) reject();
			}
			var _p = json? typeof(p) == "object"? JSON.stringify(p) : p : p;
			xhr.send(_p)
		});
		return deferred;
	}
	
	/** 
	*** HIGHCHARTS APPLICATION SPECIFIC METHODS
	*** THESE FUNCTIONS ARE ATTACHED TO THE HIGHCHARTS CHART OBJECT 
	*** USAGE: Highcharts.charts[0].{METHOD}
	**/
	function kq() {
		_this = this;
		function setArray(s) {
			var ob = JSON.parse(s);
			var x = [],
				kq = [],
				t = [],
				o = [];
			for(var i in ob) {
				x.push(ob[i].d);
				kq.push(ob[i].kq);
				t.push(ob[i].t);
				o.push(ob[i].o);
			}
			return [x,kq,t,o];
		}
		var g = _this.__g.interpret();
		_this.showLoading();
		http("/ccdb/api/kq?b=" + g[2].b + "&e=" + g[2].e + "&g=" + g[0] + "&s=[" + g[1].toString() + "]").then(function(d) {
			var a = setArray(d);
			_this.__clear();
			_this.setTitle({text: "Kontaktquote"},{text: ""});
			_this.addAxis({
				opposite: true,
				title: {
					text: "Tickets/Bestellungen"
				}
			})
			_this.yAxis[0].update({
				title: {
					text: "Kontaktquote"
				},
				floor: 0,
				ceiling: 1,
				min: 0,
				labels: {
					formatter: function() {
						return this.value * 100 + " %"
					}
				}
			})
			_this.addSeries({
				data: a[1],
				yAxis: 0,
				color: "#7cb5ec",
				name: "Kontaktquote",
				dataLabels: {
					enabled: true,
					formatter: function() {
						return (this.y * 100).toFixed(2) + " %"
					}
				},
				tooltip: {
					pointFormatter: function() {
						return "Kontaktquote: " + (this.y * 100).toFixed(2) + " %";
					}
				},
				zIndex: 1
			});
			_this.addSeries({
				data: a[2],
				yAxis: 1,
				color: "#434348",
				type: "column",
				name: "Tickets",
				dataLabels: {
					enabled: true
				}
			});
			_this.addSeries({
				data: a[3],
				yAxis: 1,
				color: "#90ed7d",
				type: "column",
				name: "Bestellungen",
				dataLabels: {
					enabled: true
				}
			});
			_this.options.plotOptions.series = {
                borderWidth: 0,
                dataLabels: {
                    enabled: true
                },
				cursor: "default"
			}
			_this.xAxis[0].setCategories(a[0]);
			_this.hideLoading();
		},function() {
			_this.hideLoading();
		})
	}

	function tt() {
		var _this = this;
		var _ls = null;
		function ls() {
			if(_ls) return _ls;
			var l = document.forms["appForm"].elements;
			var a = [];
			for(var i = 0;i<l.length;i++) {
				l.hasOwnProperty(i)? l[i].checked? !l[i].name.match(/^Alle:\b/)? a.push(l[i].name) : null : null : null;
			}
			_ls = a;
			return a
		}
		function fSum(a) {
			var x = [],
				t = {
					"MAIL": {},
					"CALL": {},
					"CHAT": {}
				}
			for(var i in a) {
				x.indexOf(a[i].d) == -1? x.push(a[i].d) : null;
				!t[a[i].Q][a[i].d]? t[a[i].Q][a[i].d] = a[i].CT : t[a[i].Q][a[i].d] += a[i].CT;
			}
			return [x,t];
		}
		function fSin(a) {

		}
		function aS(g,_g,d,s) {
			function cl(o) {
				var copy = Object();
				for (var at in o) {
					if (o.hasOwnProperty(at)) copy[at] = o[at];
				}
				return copy;
			}
			function btnCtrl() {
				function back() {
					function fun() {
						g.__lvl--;
						g.__clear();
						for(var i in g.__dDc[g.__lvl].s) {
							var o = {};
							for(var j in g.__dDc[g.__lvl].s[i]) {
								o[j] = g.__dDc[g.__lvl].s[i][j];
							}
							g.addSeries(o);
							g.xAxis[0].setCategories(g.__dDc[g.__lvl].c);
						}
					}
					g.__lvl>0? fun() : null;
					g.__lvl==0? g.__btn.destroy() : null;
				}
				function add() {
					var _css = {
						fontFamily: "'Abel', sans-serif;",
						fontSize: "130%;",
						height: "40px",
						widht: "100px"
					}
					function evt() {
						back();
					}
					g.__btn = g.renderer.button("Ebene zurück",g.plotSizeX - 100,g.plotSizeY / 10,evt,null,null,null).css(_css);
					g.__btn.add();
				}
				function dive(_t) {
					function api(lvl) {
						function _filler(res,n) {
							function replacer(match,offset,string) {
								var l = {
									"&#246;": "ö",
									"&#228;": "ä",
									"&#252;": "ü"
								}
								return l[match]
							}
							var x = [],
								y = [];
							var _res = JSON.parse(res);
							for(var i in _res) {
								_res[i]["C"]==""? x.push("offen") : x.push(_res[i]["C"].replace(/&#246;|&#228;|&#252;/g,replacer));
								y.push(_res[i]["CNT"]);
							}
							g.__clear();
							g.xAxis[0].setCategories(x);
							var o = {
								name: n,
								type: "column",
								data: y,
								cursor: "pointer",
								point: {
									events: {
										click: function() {
											g.showLoading();
											btnCtrl().dive(this);
										}
									}
								}
							}
							g.addSeries(o);
							save(o,"s");
							save(x,"c");
						}
						switch(lvl) {
							case 1:
								g.__MCC = _t.series.name;
								g.__C = _t.category;
								http("/ccdb/api/tt/cat?b=" + _g[2].b + "&e=" + _g[2].e + "&s=[" + _g[1].toString() + "]&tt=" + btoa(ls().join(",")) + "&t=" + _t.category + "&sn=" + _t.series.name + "&g=" + _g[0]).then(function(res) {
									_filler(res,"Kategorien");
								})
								g.hideLoading();
								break;
							case 2:
								http("/ccdb/api/tt/ab?t=" + g.__C + "&g=" + g.__g.__gran.__gran + "&ty=" + g.__MCC + "&c=" + _t.category).then(function(res) {
									_filler(res,"Abschluss-Codes");
								})
								g.hideLoading();
								break;
							case 3:
								break;
							case 4:
								break;
						}
					}
					g.__lvl++;
					api(g.__lvl);
				}
				function save(ob,cs) {
					function _do() {
						g.__dDc[g.__lvl].s = [];
						g.__dDc[g.__lvl].s.push(cl(ob));
					}
					cs == "s"? _do() : g.__dDc[g.__lvl].c = ob;
				}
				return {
					back: back,
					add: add,
					dive: dive,
					save: save
				}
			}
			for(var i in d[1]) {
				var a = [],
					st = s == 0? "Eingang" : "Abschluss";
				for(var j = 0;j < d[0].length;j++) {
					if(d[1][i][d[0][j]]) {
						a.push({
							name: d[0][j],
							y: d[1][i][d[0][j]]
						})
					}
				}
				var o = {
					type: "column",
					name: i + " " + st,
					data: a,
					stacking: "normal",
					stack: s,
					cursor: "pointer",
					point: {
						events: {
							click: function(e) {
								var ctrl = btnCtrl();
								ctrl.dive(this);
								g.__lvl == 1? ctrl.add() : null;
							}
						}
					}
				}
				a.length? g.__dDc[g.__lvl].s.push(cl(o)) : null;
				a.length? g.addSeries(o) : null;
			}
		}
		var _g = _this.__g.interpret();
		if(_this.__btn) {
			try {
				_this.__btn.destroy()
			} catch(e) {
				console.log(e);
			}
		}
		_this.__dDS = !!0;
		_this.__lvl = 0;
		_this.__dDc = {0:{c:[],s:[]},1:{c:[],s:[]},2:{c:[],s:[]},3:{c:[],s:[]}};
		_this.showLoading();
		http("/ccdb/api/tt/?b=" + _g[2].b + "&e=" + _g[2].e + "&g=" + _g[0] + "&s=[" + _g[1].toString() + "]&tt=" + btoa(ls().join(",")) + "&tts=" + _g[3]).then(function(res) {
			_this.__clear();
			//console.log(res);return;
			var dataI = _g[3] == "tt-Summe"? fSum(JSON.parse(res)[0]) : fSin(JSON.parse(res)[0]);
			var dataO = _g[3] == "tt-Summe"? fSum(JSON.parse(res)[1]) : fSin(JSON.parse(res)[1]);
			_this.yAxis[0].update({
				title: {
					text: "Ticketanzahl"
				},
				labels: {
					formatter: function() {
						return this.value
					}
				},
				floor: 0,
				min: 0,
				ceiling: null,
				stackLabels: {
					enabled: true,
					verticalAlign: "top",
					formatter: function() {
						return this.total
					}
				}
			})
			_this.options.plotOptions.series = {
                borderWidth: 0,
                dataLabels: {
                    enabled: true
                },
				cursor: "default"
			}
			aS(_this,_g,dataI,0);
			aS(_this,_g,dataO,1);
			if(_g[3] == "tt-Summe") {
				_this.setTitle({text: "Summe Service-Tickets"},{text: ""});
				_this.xAxis[0].setCategories(dataI[0]);
				_this.__dDc[_this.__lvl].c = dataI[0];
			} else {

			}
			_this.hideLoading();
		},function() {
			_this.hideLoading();
		})
	}

	function mv() {
		function _col(r) {
			var _a = [],
				_c = [];
			var _r = JSON.parse(r);
			for(var i in _r) {
				_c.push(_r[i].P.toString());
				_a.push([_r[i].P.toString(),_r[i].C]);
			}
			return [_c,_a]
		}
		var _this = this;
		var _l = __layer();
		var g = _this.__g.interpret();
		_this.showLoading();
		http("/ccdb/api/mv/?b=" + g[2].b + "&e=" + g[2].e).then(function(res) {
			var __res = _col(res);
			_this.__clear();
			_this.setTitle({text: "Mehrstufige Vorgänge"},{text: "Vorgänge, welche im angegebenen Zeitraum noch mindestens ein offenes Ticket hatten und die dazugehörige Anzahl aller Tickets"});
			_this.yAxis[0].update({
				title: {
					text: "Ticketanzahl"
				},
				labels: {
					formatter: function() {
						return this.value
					}
				},
				floor: 0,
				min: 0,
				ceiling: null
			})
			_this.options.plotOptions.series = {
                borderWidth: 0,
                dataLabels: {
                    enabled: true
                },
				cursor: "pointer"
			}
			_this.xAxis[0].setCategories(__res[0]);
			_this.addSeries({
				type: "column",
				data: __res[1],
				name: "Anzahl Tickets zu Vorgängen",
				color: "#FFDD00",
				point: {
					events: {
						click: function(e) {
							_l.exec(this.name);
						}
					}
				}
			})
			_this.hideLoading();
		},function() {
			_this.hideLoading();
		})
	}

	function kat() {
		function replacer(match,offset,string) {
			var l = {
				"&#246;": "ö",
				"&#228;": "ä",
				"&#252;": "ü"
			}
			return l[match];
		}
		function o2a(o) {
			var x = [],
				y = [],
				po = JSON.parse(o);
			for(var i in po) {
				x.push(po[i].C.replace(/&#246;|&#228;|&#252;/g,replacer));
				y.push(po[i].CNT);
			}
			return [x,y]
		}
		var _this = this;
		var _g = _this.__g.interpret();
		_this.showLoading();
		http("/ccdb/api/kat?b=" + _g[2].b + "&e=" + _g[2].e + "&c=" + JSON.stringify(_g[4]) + "&s=[" + _g[1].toString() + "]").then(function(res) {
			var _r = o2a(res);
			_this.__clear();
			_this.setTitle({text: "Anzahl Eingänge in Kategorien"},{text: "Aggregierte Eingänge in Kategorien im angegebenen Zeitraum"});
			_this.yAxis[0].update({
				title: {
					text: "Ticketanzahl"
				},
				labels: {
					formatter: function() {
						return this.value
					}
				},
				floor: 0,
				min: 0,
				ceiling: null
			})
			_this.options.plotOptions.series = {
                borderWidth: 0,
                dataLabels: {
                    enabled: true
                },
				cursor: "pointer"
			}
			_this.xAxis[0].setCategories(_r[0]);
			_this.addSeries({
				type: "column",
				data: _r[1],
				name: "Anzahl Tickets",
				color: "#7CB5EC",
				point: {
					events: {
						click: function(e) {
							
						}
					}
				}
			})
			_this.hideLoading();
		},function(err) {
			_this.hideLoading();
		})
	}

	function ab() {
		function replacer(match,offset,string) {
			var l = {
				"&#246;": "ö",
				"&#228;": "ä",
				"&#252;": "ü"
			}
			return l[match];
		}
		function o2a(o) {
			var x = [],
				y = [],
				po = JSON.parse(o);
			for(var i in po) {
				x.push(po[i].C.replace(/&#246;|&#228;|&#252;/g,replacer));
				y.push(po[i].CNT);
			}
			return [x,y]
		}
		var _this = this;
		var _g = _this.__g.interpret();
		_this.showLoading();
		http("/ccdb/api/ab?b=" + _g[2].b + "&e=" + _g[2].e + "&c=" + JSON.stringify(_g[4]) + "&s=[" + _g[1].toString() + "]").then(function(res) {
			var _r = o2a(res);
			_this.__clear();
			_this.setTitle({text: "Anzahl Abschlüsse in AB-Codes"},{text: "Aggregierte Abschlüsse im angegebenen Zeitraum"});
			_this.yAxis[0].update({
				title: {
					text: "Abschlüsse"
				},
				labels: {
					formatter: function() {
						return this.value
					}
				},
				floor: 0,
				min: 0,
				ceiling: null
			})
			_this.options.plotOptions.series = {
                borderWidth: 0,
                dataLabels: {
                    enabled: true
                },
				cursor: "pointer"
			}
			_this.xAxis[0].setCategories(_r[0]);
			_this.addSeries({
				type: "column",
				data: _r[1],
				name: "Anzahl Abschlüsse",
				color: "#F45B5B",
				point: {
					events: {
						click: function(e) {
							
						}
					}
				}
			})
			_this.hideLoading();
		},function(err) {
			_this.hideLoading();
		})
	}

	function tk() {
		var _this = this;
		var _g = _this.__g.interpret();
		http("/ccdb/api/tk?b=" + _g[2].b + "&e=" + _g[2].e + "&tk=" + _g[5].toString() + "&s=[" + _g[1].toString() + "]").then(function(res) {
			console.log(res);
		})
	}

	/**
	*** HIGHCHARTS GENERAL CONFIG
	**/
	function highchartsBoot() {
		_hC.setOptions({
			lang: {
				loading: "Daten werden geladen...",
				months: ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],
				noData: "Keine Daten vorhanden",
				resetZoom: "zurück",
				shortMonths: ["Jan","Feb","Mrz","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"],
				weekdays: ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],
				shortWeekdays: ["So","Mo","Di","Mi","Do","Fr","Sa"]
			}
		})
		//Chart init
		var cB = "chart-box";
		var o = {
			credits: {
				text: "Customer Care Dashboard",
				href: "javascript:void(0)"
			}
		}
		var __c = _hC.chart(cB,o);
		return __c;
	}
	//TEST TO BE REMOVED ******************************************************
	return _oLayerHandler
}(Highcharts))
