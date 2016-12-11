document.addEventListener("DOMContentLoaded",function() {
	var f = document.getElementsByTagName("FORM")[0];
	f.addEventListener("submit",function(e) {
		e.preventDefault();
		var xhr = new XMLHttpRequest();
		xhr.open("POST","/auth",true);
		xhr.onreadystatechange = function() {
			if(this.Status == )
		}
	},false);
},false);