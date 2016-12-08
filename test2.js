const events = require("events");

var Foo = function(init) {
	this.count = init;
}
Foo.prototype = new events.EventEmitter;
Foo.prototype.increment = function() {
	var self = this;
	setInterval(function() {
		if(self.count % 2 === 0) self.emit("even");
		self.count++;
	},100)
}
var foo = new Foo(1);
foo.on("even",function() {
	console.log("EVEN: " + this.count);
});
foo.increment();