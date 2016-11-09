module.exports =function () {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: {
			'color' : '&color',
			'caption' : '&title',
			'progress' : '&progress'
		},
		link: function(scope, ele, attr, ctrl) {
			var total = parseInt( attr.total ) || 100;
			var bar = angular.element( ele.children()[1] );

			scope.$watch(scope.progress, function (value) {
				bar.css({
					'width' : ( ( Number(value) * 100 ) / total ) +  '%'
				});
			});

			scope.$watch(scope.color, function (value) {
				scope.cls = value;
			});
		},
		template : 	'<div class="ng-progress-bar">' + 
						'<span class="caption" ng-transclude></span>' +
						'<div class="bar {{cls}}"></div>' +
					'</div>'
	};
};
module.exports.$inject = [];