module.exports =function (api){
	return {
		restrict: 'A',
		scope: {
			background : '='
		},
		link : function (scope, ele) {
			ele.css({
				backgroundImage : 'url("' + api.replace('api', 'embe') + '400x200' + scope.background +'")'
			});
		}
	};
};

module.exports.$inject = ['API'];
