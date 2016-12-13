function failChange(element) {
	if(element.classList.value.indexOf("hide") > -1) {
		element.classList.remove("hide");
		element.classList.add("show");
	}
}
document.addEventListener("DOMContentLoaded",function() {
	var f = document.forms[0];
	var p = f.password;
	var ch = f.ch;
	var a = document.getElementById("alert");
	f.addEventListener("submit",function(evt) {
		evt.preventDefault();
		var xhr = new XMLHttpRequest();
		xhr.open(this.method,this.action,true);
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xhr.onreadystatechange = function() {
			if(this.readyState == 4) {
				if(this.status > 400) {
					failChange(a);
					a.textContent = JSON.parse(this.responseText).status;
				} else {
					window.location = "/" + JSON.parse(this.responseText).location;
				}
			}
		}
		xhr.send("password=" + p.value + "&ch=" + ch.value);
	},false);
},false);