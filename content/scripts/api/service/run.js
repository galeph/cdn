module.exports = function (root, am, lang, win) {
	root.ready = function() {
		root.status = 'ready';
		if(!root.$$phase) root.$apply();
	};

	root.loading = function() {
		root.status = 'loading';
		if(!root.$$phase) root.$apply();
	};

	root.$on('$routeChangeStart', function() {
		root.loading();
	});

	
};

module.exports.$inject = [ '$rootScope', 'amMoment', 'LANG'];