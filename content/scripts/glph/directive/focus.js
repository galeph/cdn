module.exports =function (time){
	return {
		restrict: 'A',
		scope: {
			meFocus : '='
		},
		bindToController: true,
		link : function (scope, ele) {
			scope.meFocus = false;
			ele.bind('focus', function () {
				ele.addClass('active');
				scope.meFocus = true;
			});
			ele.bind('blur', function () {
				ele.removeClass('active');
				time(function () {
					scope.meFocus = false;
				}, 1000);
			});
		}
	};
};

module.exports.$inject = ['$timeout'];
