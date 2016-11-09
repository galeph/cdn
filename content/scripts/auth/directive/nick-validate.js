module.exports = function () {
	return {
		require: 'ngModel',
		link: function(scope, ele, attrs, crtl) {
			var total = parseInt( attr.validation ) || 100;
			scope.$watch(attrs.ngModel, function (newVal, view) {
				crtl.$setValidity('partens', reg.test( crtl.$modelValue || newVal ) );
			});
		}
	};
};

module.exports.$inject = [];