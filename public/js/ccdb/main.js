function evtClick(l,fun) {
	l.addEventListener("click",function() {
		fun();
	},false);
}

function Source(id,imgSrc) {
	var s = document.getElementById("unit-sources");
	var div = document.createElement("DIV");
	div.classList.add("unit");
	div.classList.add("relative");
	var template = 	"<div class='unit-label absolute'>" + 
						"<div class='inline-block unit-checkbox relative'>" + 
							"<div id='" + id + "' class='unit-inner-checkbox absolute checked'></div>" + 
						"</div>" + 
						"<div class='inline-block unit-text' style='background-image:url(\"../../img/" + imgSrc + "\"'></div>" + 
					"</div>";
	div.innerHTML = template;
	s.append(div);
	var idL = document.getElementById(id);
	idL.addEventListener("click",function() {
		o.changeStatus();
		if(idL.classList.contains("checked"))
			idL.classList.remove("checked");
		else
			idL.classList.add("checked");
	},false);
	var o = {
		status: true,
		id: id,
		changeStatus: function() {
			this.status = !this.status;
		},
		resize: function(s) {
			div.style.width = s;
		}
	};
	return o;
}

document.addEventListener("DOMContentLoaded",function() {
	//aLink
	var kqL = document.getElementById("kq");
	var kqLfun = function() {
		var c = document.getElementsByClassName("chart-menu-inner-content")[0];
		var t = document.createElement("a");
		t.setAttribute("href","#");t.textContent = "TEST";
		c.append(t);
	}
	evtClick(kqL,kqLfun);
	//
	//bootstrap sources
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
	var chartMenuBtn = document.getElementById("chart-menu-symbol");
	var chartMenuContent = document.getElementById("chart-menu-content");
	chartMenuBtn.addEventListener("click",function() {
		if(chartMenuContent.classList.contains("expander")) {
			chartMenuContent.classList.remove("expander");
		} else {
			chartMenuContent.classList.add("expander");
		}
	},false);
	var calendarElements = document.getElementsByClassName("chart-calendar-elements");
	for(var i=0;i<calendarElements.length;i++) {
		$(calendarElements[i]).datepicker({
				format: "dd.mm.yyyy",
				calendarWeeks: true,
				orientation: "bottom right",
				autoclose: true,
				language: "de",
				todayHighlight: true
			});
		if(i==0) {
			var d = new Date();
			var y = d.getFullYear();
			var nd = new Date(y,0,1);
			$(calendarElements[i]).datepicker("setDate",nd);
		} else {
			var nd = new Date();
			$(calendarElements[i]).datepicker("setDate",nd);
		}
	}
	var chartSection = document.getElementsByClassName("chart-section")[0];
	chartSection.style.height = (document.body.clientHeight - chartSection.getBoundingClientRect().top) + "px";
	//modelBoot
	(function() {
		function resize(a) {
			var le = (100/a.length);
			a.forEach(function(l) {
				l.resize(le + "%");
			})
		}
		//cahnge button
		var btnApply = document.getElementById("btn-apply");
		btnApply.addEventListener("click",function() {
			console.log(sources);
		},false);
		//config menu
		var s1 = Source("check-ayn","ayn.png");
		var s2 = Source("check-pp-de","ayn.png");
		var s3 = Source("check-pp-aut","ayn.png");
		var sources = [s1,s2,s3];
		resize(sources);
		var __c = highchartsBoot();
	}())
},false);



function twoDigits(val) {
	if(val.toString().length < 2) {
		return "0" + val;
	}
	return val;
}

function toMysqlDate(d) {
	var t = d.substr(0,2);
	var m = d.substr(3,2);
	var y = d.substr(6,4);
	return y + "-" + m + "-" + t;
}

//api request
function http(src,params) {
	var p = params || null;
	var deferred = new Promise(function(resolve,reject) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET",src,true);
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4 && xhr.status == 200) {
				resolve(xhr.responseText);
			}
			if(xhr.status != 200) reject();
		}
		xhr.send(p)
	});
	return deferred;
}

function clearChart() {
	while(__c.series.length) {
		__c.series[0].remove();
	}
	while(__c.yAxis[1]) {
		__c.yAxis[1].remove();
	}
}

function kq() {
	function setArray(s) {
		var o = JSON.parse(s);
		var x = [],
			kq = [],
			tickets = [],
			orders = [];
		for(var i in o) {
			x.push(o[i].year + "/" + o[i].month);
			kq.push(o[i].kq);
			tickets.push(o[i].tickets);
			orders.push(o[i].orders);
		}
		return [x,kq,tickets,orders];
	}
	var b = document.getElementsByClassName("chart-calendar-elements")[0].value;b=toMysqlDate(b);
	var e = document.getElementsByClassName("chart-calendar-elements")[1].value;e=toMysqlDate(e);
	http("/ccdb/api/kq?b=" + b + "&e=" + e).then(function(d) {
		var a = setArray(d);
		clearChart();
		__c.setTitle({text: "Kontaktquote"});
		__c.addAxis({
			opposite: true,
			title: {
				text: "Tickets/Bestellungen"
			}
		})
		__c.yAxis[0].update({
			title: {
				text: "Kontaktquote"
			},
			max: 1,
			labels: {
				formatter: function() {
					return this.value * 100 + " %"
				}
			}
		})
		__c.addSeries({
			data: a[1],
			yAxis: 0,
			name: "Kontaktquote",
			tooltip: {
				pointFormatter: function() {
					return "Kontaktquote: " + this.y * 100 + " %";
				}
			}
		});
		__c.addSeries({
			data: a[2],
			yAxis: 1,
			type: "column",
			name: "Tickets"
		});
		__c.addSeries({
			data: a[3],
			yAxis: 1,
			type: "column",
			name: "Bestellungen"
		});
		__c.xAxis[0].setCategories(a[0]);
	})
}

//Highcharts general options
function highchartsBoot() {
	Highcharts.setOptions({
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
	var __c = Highcharts.chart(cB,o);
	return __c;
}