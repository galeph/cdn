module.exports = function (send, ap, go) {
	return {
		restrict: 'A',
		scope : {
			'mailActive' : '@',
			'ids' : '@id',
			principal : '='
		},
		bindToController: true,
		templateUrl : 'actives',
		link : function (scope, element, attr) {
			scope.isActive = angular.isString(attr.confirm);
			scope.sendMail = function () {
				send.post(ap.replace('api', 'auth') + 'mail/active/' + scope.ids )
					.success(function (data) {
						scope.sendData = data.is;
					})
					.error( function(data) {
						scope.sendData = data.is;
					});
			};
			scope.Deletes = function () {
				go.emit('change:settings', {
					type : 'email',
					id : scope.ids
				}, function (is) {
					if(is) element.remove();
				});
			};
		}
	};
};

module.exports.$inject = ['$http', 'API', 'socket'];