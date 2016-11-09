module.exports = function (fac, api, conf) {
	return fac({
		ioSocket : require('socket.io-client').connect(api.replace(/http(s)?\:|\//gim, ''), conf),
	});
};

module.exports.$inject = [ 'socketFactory', 'API', 'CONF' ];
