module.exports =function (socket, interval, local) {
	var context = {
		'cart' : {
			icon : 'shopping-cart',
			path : '/cart'
		},
		'bays' : {
			icon : 'tag',
			path : '/pay'
		},
		'sell' : {
			icon : 'line-chart',
			path : '/sell'
		},
		'news' : {
			icon : 'bullhorn',
			path : '/news'
		}
	};
	return {
		restrict: 'A',
		scope : {
			'ngIcon' : '@',
			'alts' : '@',
			'urls' : '@'
		},
		link : function (scope, element, attr) {
			var is = context[ scope.ngIcon ];
			scope.types = [ 'icon', 'icon-lg',  'icon-' + is.icon ];
			socket.on('notify:' + scope.ngIcon, function (data) {
				scope.count = data;
			});

			function sender () {
				socket.emit('notify:' + scope.ngIcon, true);
			}

			/*if( context.sets.indexOf( scope.ngIcon ) >= 0 )
				scope.intervals = interval(sender, 1200);*/

			if(attr.shows === 'true' ){
				scope.shows = scope.alts;
				scope.types = [];
			}
			scope.$watch(function () {
				return local.path();
			}, function (nuevo) {
				if(nuevo.toLowerCase().indexOf(is.path) >= 0){
					element.addClass('active');
				} else {
					element.removeClass('active');
				}
			});

			sender();
		},
		template :	'<a ng-href="{{urls}}" ng-class="types" alt="{{alts}}" target="_self">{{shows}}' + 
						'<span class="badge red" ng-show="count">{{count | max:0}}</span>' +
					'</a>'
	};
};

module.exports.$inject = [ 'socket', '$interval', '$location' ];