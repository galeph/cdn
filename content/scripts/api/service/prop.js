module.exports = function (us, loco, door, res){
	var bell = res('https://:host/api/applications/:id/:action?key=:api', door, {
		open : {
			cache : false,
			method:'GET',
			withCredentials : false,
			params: {
				action: 'open'
			}
		},
		submit : {
			cache : false,
			method:'POST',
			withCredentials : false,
			params : {
				action : 'submit'
			}
		}
	});
	return {
		doorbell : bell,
		send : function (id, data, sus, fail) {
			data.properties = JSON.stringify({ user : us, url : loco.absUrl(), item : id });
			bell.submit(data, sus, fail);
		}
	};
};

module.exports.$inject = [
	'USER',
	'$location',
	'DOOR',
	'$resource'
];