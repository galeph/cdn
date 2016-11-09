module.exports =function ( sock, api, ses ){
	var crtl = [ '$scope', '$element', '$attrs', function (scope, ele, attrs) {
		scope.me = true;
		scope.isFollow = false;
		scope.hover = false;
		scope.isBlock =  false;

		scope.following = function (){
			sock.emit('change:follow', scope.follow);
		};

		scope.block = function (){
			sock.emit('change:block', scope.follow);
		};

		sock.on('follow', function (ms){
			if( scope.follow === ms.id  ){
				scope.isFollow = angular.isObject(ms.is) && ms.is.public;
				if(ms.me) ele.remove();
			}
		});

		sock.on('block', function (ms){
			if( scope.follow === ms.id  ){
				scope.isBlock = angular.isObject(ms.is) && !ms.is.public;
			}
		});

		sock.emit('view:glph:friend', scope.follow);
	}];

	return {
		restrict: 'A',
		transclude : true,
		controller: crtl,
		scope : {
			follow : '='
		},
		templateUrl : api.replace('api','search') + ses + '.follow'
	};

};

module.exports.$inject = ['socket','API', 'SESSION'];
