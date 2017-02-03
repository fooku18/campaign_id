def outer():
	_t = "Hundesau"
	def inner():
		print "Du dumme " + _t
	return inner

_f = outer()
_f()