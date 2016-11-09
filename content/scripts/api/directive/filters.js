module.exports =function () {
	return {
		restrict: 'A',
		scope : {
			'fill' : '&'
		},
		bindToController: true,
	};
};

module.exports.$inject = [];