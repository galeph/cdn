module.exports =function (){
	return {
		restrict: 'E',
		transclude: true,
		replace: true,
		scope : {
			'indexPut' : '=put',
			'name' : '=',
		},
		link : function (scope, elez, attr, ctrl) {
			if(!angular.isArray(ctrl.list))
				ctrl.list = [];

			ctrl.list[ scope.indexPut ] = scope.name;
		},
		templateUrl : 'cardx'
	};
};

module.exports.$inject = [];