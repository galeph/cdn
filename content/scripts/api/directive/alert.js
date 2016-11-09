module.exports =function (go) { 
	return {
		restrict: 'E',
		transclude: true,
		replace: true,
		scope : {
			'status' : '@color',
			'title' : '@',
			'indez' : '@num',
			'close': '&?'
		},
		link : function(scope, elez, attr) {
			scope.types = scope.title ? 'block' : 'basic';
			scope.show = scope.types === 'block';
			scope.closer = function(){
				go.emit('del:alert', scope.indez );
				if(angular.isString(attr.remove)) angular.element(elez).remove();
				scope.close();
			};
		},
		template :	'<div class="alert {{types}} {{status}}" role="alert">' + 
						'<button class="ng-dismiss close" ng-click="closer()">&times;</button>' +
						'<h4 ng-if="show">{{title}}</h4>' +
						'<ng-transclude></ng-transclude>' +
					'</div>'
	};
};

module.exports.$inject = [ 'socket' ];