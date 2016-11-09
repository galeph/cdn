function well (mod, local, send, timeOut) {
	this.local = local;
	this.send = send;
	this.items = { 'video' : [], 'image' : [], 'audio': [] };
	this.rhx = true;
	this.datas = {
		page : 0,
		date : new Date()
	};
	mod.ready();
	send.on('view', this.getView.bind(this));
	timeOut(this.push, 1000);
}

well.prototype.push = function(x) {
	if( this.rhx ){
		var page = angular.copy(this.datas);
		if( this.ids ) page.id = this._id;
		page.search = this.local.search();
		this.rhx = !this.rhx;
		this.send.emit('view:www:wellcome', this.datas );
	}
};

well.prototype.getView = function(doc) {
	this.datas.page++;
	for (var prop in docs) {
		if (docs.hasOwnProperty(prop) && docs[prop].length > 0 )
			this.adds( prop, docs[prop] );

	}
	if ( docs )	this.rhx = !this.rhx;
};

well.prototype.adds = function(name, doc) {
	for (var i = doc.length - 1; i >= 0; i--)
		this.items[ name ].push( doc[i] );
};

well.$inject = require('api').config1

module.exports = well;
