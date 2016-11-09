module.exports =function (local){
	return {
		restrict: 'A',
		link : function (scope, ele, attr) {
			scope.$watch(function () {
				return local.url();
			}, function(e) {
				scope.tos = /^\/[0-9a-z\-\_]{16}/i.test(e) ? 'pencil-square-o' : 'cogs';
			});
			scope.$watch(function () {
				return local.search();
			}, function(e) {
				if(e && e.to === 'edit')
					scope.edit = true;
			});
		},
		template : '<i class="icon icon-{{tos}}"/>'
	};
};

module.exports.$inject = ['$location'];