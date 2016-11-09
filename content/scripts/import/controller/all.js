module.exports = function (mod, params, soc, time){
	var that = this;
	that.tab = { video : false, images : false, audio : false, contact : false };
	if( !that.tab[ params.path().split('/')[1] ] )
		that.tab[ params.path().split('/')[1] ] = true;

	mod.$watch(function() {
		return params.path();
	}, function(news){
		for (var prop in that.tab) {
			if (that.tab.hasOwnProperty(prop)) {
				that.tab[ prop ] = false;
			}
		}
		
		that.tab[ news.split('/')[1] ] = true;
	});
};

module.exports.$inject = require('api').config1;