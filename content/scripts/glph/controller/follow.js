function follow (socket, q) {
	this.soc = socket;
	this.q = q;
}

follow.prototype.search = function(term) {
	var that = this;
	return that.sock.emit('follow:search', term, function (users){
		return that.other.when(users);
	});
};

follow.prototype.get = function(item) {
	return '@' + item.name;
};

follow.$inject = ['socket', '$q']

module.exports = follow;