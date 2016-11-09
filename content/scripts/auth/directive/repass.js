module.exports =function () {
	return {
		require: 'ngModel',
		scope : {
			compare : '=rePass'
		},
		link: function ($scope, ele, attrs, ngModel) {
			ngModel.$parsers.push(function (value){
				ngModel.$setValidity('matchs', value === $scope.compare);
				return value;
			});
		}
	};
};

module.exports.$inject = [];
