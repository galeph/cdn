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
		.when('/', {
			templateUrl: urlx + session + '.lobby',
			controller: 'Crtl',
			controllerAs : 'c'
		})
		.when('/news', {
			templateUrl: urlx + session + '.news',
			controller: 'Crtl',
			controllerAs : 'c'
		})
		.when('/wellcome', {
			templateUrl : urlx + session + '.me',
			controller : 'Crtl',
			controllerAs : 'c'
		})
		.when('/settings/:tab?', {
			templateUrl : urlx + session + '.settings',
			controller : 'Setting',
			controllerAs : 's'
		})
		.otherwise({
			templateUrl: urlx + session + '.error',
		});
};

module.exports.$inject = con.config;