var con = require('api');
for (var i = con.white.length - 1; i >= 0; i--)
	con.white[i] = new RegExp(con.white[i], 'i');
con.white.push('self');

module.exports = function (log, delegate, compile, locat, recap, key, httpP, route, session, urlx, analytics, user){
	analytics.settings.ga.userId = user;
	log.debugEnabled(con.com);
	compile.debugInfoEnabled(con.com);
	httpP.defaults.withCredentials = true;
	locat.html5Mode(true);
	recap.setPublicKey(key);
	recap.setOptions(con.recap);
	delegate.resourceUrlWhitelist(con.white);
};

module.exports.$inject = con.config;