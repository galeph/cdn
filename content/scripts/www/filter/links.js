var URIS = /(?:http(s)?\:\/\/|www\.)+(?![^\s]*?")([\w.,@?!^=%&amp;:\/~+#-]*[\w@?!^=%&amp;\/~+#-])?/ig;
var com = require('api').comment;

module.exports =function (api) {
	var replacers = [{
		patenr : /(^|\s)\@([a-z]{1}[a-z0-9_-]{3,13}[a-z|0-9]{1})/g,
		replace : '$1<a href="' + api.replace('api', '$2') + '">@$2</a>'
	},{
		patenr : /(^|\s)*#([\u00C0-\u1FFF\w]+)/g,
		replace : '$1<a href="' + api.replace('api', 'search' ) + '?' + require('api').search + '%23$2">#$2</a>'
	}];
	return function (input, number) {
		var out = ( input || '' ) + '';
		var num = ( !!parseInt(number) ? parseInt(number) : com ) - input.length;

		for (var i = replacers.length - 1; i >= 0; i--)
			out = out.replace( replacers[i].patenr, replacers[i].replace );

		return out.replace(URIS, function (m1){
				var si = m1.replace( /http(s)?\:\/\//i, '');
				var sa = si.length >= num ? '...' : '' ;
				return ' <a href="' + m1 + '" target="_blank">' + si.substring(0, num) + sa + '</a> ' ;
			});
	};
};

module.exports.$inject = [ 'API' ];