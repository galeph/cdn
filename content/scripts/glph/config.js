var con = require('api');
for (var i = con.white.length - 1; i >= 0; i--)
	con.white[i] = new RegExp(con.white[i], 'i');
con.white.push('self');
module.exports =function (log, delegate, compile, locat, recap, key, httpP, route, session, urlx, analytics, user){
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
			templateUrl : urlx + session + '.album',
			controller : 'Crtl',
			controllerAs : 'c'
		})
		.when('/followers', {
			templateUrl: urlx + session + '.contact-ers',
			controller : 'Crtl',
			controllerAs : 'c'
		})
		.when('/following', {
			templateUrl: urlx + session + '.contact-ing',
			controller : 'Crtl',
			controllerAs : 'c'
		})
		.when('/album/:name', {
			templateUrl : function(param){
				return urlx + session + '.album/' + param.id;
			},
			controller : 'Crtl',
			controllerAs : 'c'
		})
		.when('/:id', {
			templateUrl : function(param){
				return urlx + session + '.item/' + param.id;
			},
			controller : 'Crtl',
			controllerAs : 'c'
		})
		.otherwise({
			templateUrl: urlx + session + '/error'
		});
};

module.exports.$inject = con.config;