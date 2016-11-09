module.exports =function (res, api) {
	return res(api + 'method/:my', {
		my : 'get'
	},{
		get : {
			method : 'GET',
			params : {
				my : 'get'
			},
			isArray : true,
			cache : true
		},
		send : {
			method : 'GET',
			params : {
				my: 'send'
			},
			isArray : true,
			cache : true
		}
	});
};

module.exports.$inject = ['$resource', 'API'];