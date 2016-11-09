module.exports = function () { 
	return {
		restrict: 'A',
		require: 'ngModel',
		scope : {
			intes: '=ngModel'
		},
		link : function(scope, elez, attrs) {
			scope.intes = scope.$eval(attrs.inValue);
		}
	};
};

module.exports.$inject = [];