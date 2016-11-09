module.exports =function () {
	return {
		link: function ($scope, elez, attr) {
			$scope.fox = attr.reInput.split(',');
		}
	};
};

module.exports.$inject = [];
