var con = require('api');
for (var i = con.white.length - 1; i >= 0; i--)
	con.white[i] = new RegExp(con.white[i], 'i');
con.white.push('self');
module.exports = function (log, delegate, compile, locat, recap, key, httpP, route, session, urlx, analytics, user){
	analytics.settings.ga.userId = user;
	analytics.firstPageview(con.com); /* Records pages that don't use $state or $route */
	analytics.withAutoBase(con.com);  /* Records full path */
	log.debugEnabled(con.com);
	compile.debugInfoEnabled(con.com);
	httpP.defaults.withCredentials = true;
	locat.html5Mode(con.com);
	recap.setPublicKey(key);
	recap.setOptions(con.recap);
	delegate.resourceUrlWhitelist(con.white);
	route
		.when('/top', {
			templateUrl: urlx + session + '.top',
			controller: 'Ctrl',
			controllerAs : 'c'
		})
		.when('/explore', {
			templateUrl: urlx + session + '.explore',
			controller: 'Ctrl',
			controllerAs : 'c'
		})
		.when('/:name?', {
			templateUrl: function (param) {
				return urlx + session + '.search?name=' + param.name ;
			},
			controller: 'Ctrl',
			controllerAs : 'c'
		})
		.otherwise({
			templateUrl: urlx + session + '.error',
		});
};

module.exports.$inject = con.config;