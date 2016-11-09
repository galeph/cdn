module.exports =function () {
	return function (input, classes) {
		var max = angular.isString(classes) ? classes : 'active';
		return input ? max : '';
	};
};
module.exports.$inject = [];