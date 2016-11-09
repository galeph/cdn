module.exports =function (go, time) { 
	return {
		restrict: 'C',
		link : function(scope, elez) {
			scope.text = '';
			scope.status = '';
			scope.show = function (data) {
				elez.removeClass('ng-hide');
				elez.addClass('ng-show');
				scope.text = data.msg;
				scope.status = data.status;
				scope.times = time(scope.close, 3000);
			};

			scope.close = function () {
				elez.removeClass('ng-show');
				elez.addClass('ng-hide');
				if(scope.times && scope.times.cancel) scope.times.cancel();
			};

			go.on('mesg:shows', scope.show);
		},
		template :	'<div class="ng-grid ie7 ng-gutter">' + 
						'<div class="all-50 push-center white"><alert color="{{status}}" on-close="close()">{{text}}</alert></div>' +
					'</div>'
	};
};

module.exports.$inject = [ 'socket', '$timeout' ];