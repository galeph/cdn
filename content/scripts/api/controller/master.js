function master (mods, socket, name, local, params, log ){
	go.on('error', log.error);

	this.local = local;
	this.go = socket;

	this.filters = {};
	this.noMore = false;
	this.rhx = true;
	this.items = [];
	this.more = [];
	this.datas = {
		page : 0,
		date : new Date()
	};
	this.flrz = [];

	var that = this;

	mods.$watch(function () {
		return that.Event;
	}, function(e) {
		if(local.search().page)
			that.datas.page = local.search().page;
		if( params && params.id){
			if( params.id.length === 16 || params.id.length === 24 )
				that.datas.nit = params.id;
		}

		that.push();
	});

	mods.$watch(function () {
		return that.flrz;
	}, function (newValue) {
		if(angular.isArray(newValue)){
			for (var i = newValue.length - 1; i >= 0; i--)
				that[ newValue[i].index ? 'item' : 'more'  ].push(newValue[i]);
		}
	});

	if(name != 'search' && name != 'comment'){
		mods.$watch(function () {
			return that.bar;
		}, function (newValue) {
			that.filters = newValue;
		});	
	}

	if(name == 'search'){
		mods.$watch(function () {
			return local.search();
		}, function (newValue) {
			that.bar = newValue.q;
		});
	}

	that.go.on('view', function (docs){
		that.datas.page++;
		if( Array.isArray(docs) && !that.rhx ){
			for (var i = 0; i < docs.length; i++)
				that.items.push( docs[i] );
			if( docs.length >= 1 ) that.rhx = !that.rhx;
			that.noMore = docs.length === 0;
		} else if( angular.isObject(docs) && !that.rhx ) {
			var is = true;
			if( Array.isArray(that.items) ) that.items = {};
			angular.forEach(docs, function (col, index) {
				if( !Array.isArray(that.items[index]) )
					that.items[index] = [];

				for (var i = col.length - 1; i >= 0; i--)
					that.items[index].push(col[i]);
			});
		}
	});

	that.go.on('put', function (doc) {
		if(!doc.index)
			that.items.splice(0, 0, doc);
		else
			angular.extend(that.items[ doc.index ], doc);
	});

	that.go.on('delete', function (item) {
		that.pull(item, 'items');
	});
}

master.prototype.pull = function(card, name) {
	var index = this[name].indexOf( card );
	if(index >= 0 )
		this[ name ].splice( index, 1 );
};

master.prototype.select = function(card, name) {
	this[name].push(card);
};

master.prototype.push = function() {
	if( this.rhx ){
		var page = angular.copy(this.datas);
		if( this._id ) page.id = this._id;
		page.query = this.local.search();
		if(page.query.page) delete page.query.page;
		this.rhx = !this.rhx;
		this.go.emit( 'view:' + name + ':' + mods.Event, page);
	}
};

master.$inject =  [ '$scope', 'socket', 'NAME', '$location', '$routeParams', '$log' ];

module.exports = master;