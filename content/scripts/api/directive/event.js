module.exports = function () { 
	return {
		restrict: 'A',
		//bindToController: true,
		link : function(scope, elez, attrs) {
			scope.Event = attrs.ngEvent;
		}
	};
};
module.exports.$inject = [];