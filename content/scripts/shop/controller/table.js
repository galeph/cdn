module.exports =function (mod, loc, soc, time ){
	var that = this;
	that.items = [];
	that.datas = {
		page : 0,
		date : new Date()
	};

	that.checkout = function () {
		if( that.rhx ){
			var page = angular.copy(that.datas);
			that.rhx = !that.rhx;
			soc.emit('view:shop:checkout:table', page);
		}
	};

	that.goTo = function (index) {
		var card = that.items[index].success_path;
		loc.path(card);
	};

	soc.on('view:table', function (docs) {
		that.datas.page++;
		if( Array.isArray(docs) && !that.rhx ){
			for (var i = 0; i < docs.length; i++)
				that.items.push( docs[i] );
			if( docs.length >= 1 ) that.rhx = !that.rhx;
			that.noMore = docs.length === 0;
		}
	});

	that.checkout();
};

module.exports.$inject = require('api').config1;