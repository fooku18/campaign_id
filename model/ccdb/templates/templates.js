module.exports._f = function() {
	return "!function() {" + 
					"function _dS(l) {" +
						"l.addEventListener('dragstart',function(e) {" +
							"l.style.opacity = '.5';" + 
							"e.dataTransfer.dropEffect = 'move';" +
							"e.dataTransfer.setData('text/plain',l.firstChild.textContent + ':' + l.getAttribute('data-be-id'));" +
							"_trgt.classList.remove('drag-none');_trgt.classList.add('drag-act');" +
						"},false);" + 
					"}" +
					"function _dSt(l) {" +
						"l.addEventListener('dragend',function(e) {" +
							"l.style.opacity = '1';" + 
							"_trgt.classList.remove('drag-act');_trgt.classList.add('drag-none');" +
						"},false);" +
					"}" +
					"function c(t) {" + 
						"var _s = Array.prototype.slice.call(document.querySelectorAll('[data-be-id]'),0)," + 
						"	_id = parseInt(_s[_s.length-1].getAttribute('data-be-id'))+1," +
						"	 _d = document.createElement(\"div\")," + 
						"	__d = document.createElement(\"div\")," + 
						"	 _s = document.createElement(\"span\")," +
						"	 _t = document.querySelector('.be-m-b');" +
						"_d.classList.add('be-unit');_d.setAttribute('draggable',true);_d.setAttribute('data-be-id',_id);" +
						"_s.textContent = t;__d.classList.add('be-unit-i');__d.appendChild(_s);_d.appendChild(__d);" +
						"_t.appendChild(_d);_dS(_d);_dSt(_d);" +
					"}" +
					"function _c(t) {" +
						"var _d = document.createElement(\"div\")," + 
						"	 __d = document.createElement(\"div\")," + 
						"   ___d = document.createElement(\"div\")," + 
						"	 _s = document.createElement(\"span\"),__s = document.createElement(\"span\")," +
						"	 _p = t.split(':');" +
						"_d.classList.add('be-unit','be-unit-d');__d.classList.add('be-unit-i');___d.classList.add('be-unit-ix');_s.textContent = _p[0];__s.classList.add('glyphicon','glyphicon-remove');" +
						"__d.appendChild(_s);___d.appendChild(__s);_d.appendChild(__d);_d.appendChild(___d);_trgt.appendChild(_d);" +
						"_src.removeChild(document.querySelector('[data-be-id=\"' + _p[1] + '\"]'));" +
						"___d.addEventListener('click',function() {" + 
						"	_d.parentNode.removeChild(_d);" +
						"	c(_p[0]);" +
						"},false);" +
					"}" +
					"var _trgt = document.querySelectorAll('.be-m-b')[1]," + 
					"	 _src = document.querySelectorAll('.be-m-b')[0]," + 
					"	 _ipE = document.querySelector('.be-inp-c').firstChild," +
					"	 _el = Array.prototype.slice.call(document.querySelectorAll('.be-unit-d'),0);" +
					"[].forEach.call(document.querySelectorAll('.be-unit'),function(l) {" + 
						"_dS(l);" +
						"_dSt(l);" +
					"});" + 
					"if(_el.length) {" + 
						"_el.forEach(function(l) {" + 
							"l.addEventListener('click',function() {" + 
								"l.parentNode.removeChild(l);" +
								"c(l.textContent);" +
							"},false)" +
						"})" +
					"}" + 
					"_trgt.addEventListener('dragover',function(e) {" +
						"var e = e || event;" +
						"e.preventDefault();" + 
					"},false);" +
					"_trgt.addEventListener('drop',function(e) {" +
						"var e = e || event;" +
						"e.preventDefault();" +
						"_c(e.dataTransfer.getData('text/plain'));" +
					"},false);" + 
					"function _col() {" + 
						"var _s = Array.prototype.slice.call(document.querySelectorAll('.be-unit-d'),0)," + 
						"	 _r = [];" +
						"if(_s.length) {" + 
							"_s.forEach(function(l) {" + 
								"_r.push(l.textContent);" +
							"});" +
							"return _r.join(',')" +
						"} else return 0" +
					"};" +
					"_ipE.addEventListener('click',function() {" +
						"var _c = _col();" +
						"if(_c) {" + 
							"http('/ccdb/api/set_be_s?u=' + _c).then(function(res) {" +
								"_oLayerHandler.close();" + 
							"});" +
						"}" + 
					"},false);" +
				"}()";
}

module.exports._t = function() {
	return "<div class='be-t'><span>Einschließende Kategorien für die Beschwerdekosten</span></div>" +
				"<div class='be-container'>" + 
					"<div class='be-s'></div>" + 
					"<div class='be-m'>" + 
						"<div class='be-m-b'>" + 
							"###L###" + 
						"</div>" + 
					"</div>" + 
					"<div class='be-s'></div>" + 
					"<div class='be-m'>" + 
						"<div class='be-m-b drag-none'>" + 
							"###R###" + 
						"</div>" + 
					"</div>" + 
					"<div class='be-s'></div>" + 
					"<div class='clear'></div>" +
					"<div class='be-inp-c'>" +
						"<input class='btn btn-default' value='speichern' />" +
					"</div>" + 
				"</div>";
}	

module.exports._tk_f = function() {
	return 	"(function(t,c) {" +
				"var _c = {}," +
				"	 _t = {};" + 
				"c.forEach(function(l) {" +
					"!_c[l.S]? _c[l.S] = {} : null;" +
					"!_c[l.S][l.Y]? _c[l.S][l.Y] = {} : null;" +
					"!_c[l.S][l.Y][l.M]? _c[l.S][l.Y][l.M] = {} : null;" +
					"_c[l.S][l.Y][l.M] = {" +
					"	CTicket: (l.C/l.T === Infinity)? 0 : parseFloat(parseFloat(l.C/l.T).toFixed(3))," +
					"	CTime: (l.C/l.E === Infinity)? 0 : parseFloat(parseFloat(l.C/l.E).toFixed(20))" +
					"};" +
				"});" +
				"t.forEach(function(l) {" +
					"if(!_t[l.Y]) _t[l.Y] = {};" +
					"if(!_t[l.Y][l.M]) _t[l.Y][l.M] = [];" +
					"l['C_TICKET_KS'] = _c['ks'][l.Y][l.M]['CTicket'] * l.CNT_KS;" +
					"l['C_TICKET_HS'] = _c['hs'][l.Y][l.M]['CTicket'] * l.CNT_HS;" +
					"l['C_TICKET_TIME_KS'] = _c['ks'][l.Y][l.M]['CTime'] * l.EDIT_TIME_KS;" +
					"l['C_TICKET_TIME_HS'] = _c['hs'][l.Y][l.M]['CTime'] * l.EDIT_TIME_HS;" +
					"_t[l.Y][l.M].push(l)" +
				"});" +
				"return _t" + 
			"})(d.data.l,d.data.c)";
}