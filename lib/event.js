var events = require('events');
var util = require('util');
 
var Pool = function (num) {
	events.EventEmitter.call(this);
	this.data = [];
	this.active = [];
	this.threads = num || 1;
	this.on('run', this.runQuta.bind(this) );
};

util.inherits(Pool, events.EventEmitter);

Pool.prototype.runQuta = function() {
	if(this.data.length === 0 && this.data.length === 0) {
		return this.emit('done');
	}

	if(this.active.length < this.threads) {
		var name = this.data.shift();
	
		this.active.push(name);
		var self = this;
		self.emit('data', name, function (err) {
			self.active.splice(self.active.indexOf(name), 1);
			self.emit('run');
		});
	}
	return this;
};
 
Pool.prototype.init = function(data) {
	this.data = data;
	this.emit('run');
	return this;
};
 
module.exports = Pool;
