module.exports = function (user, sock){
	return {
		restrict: 'A',
		scope: {
			trash : '@',
			user :'@'
		},
		link : function (scope, ele) {
			if( scope.user != user )
				return ele.remove();
			ele.on('click', function (e) {
				scope.$parent.$parent.pull(scope.$parent.comment, 'items');
				sock.emit('delete:coment', scope.trash);
			});
		}
	};
};

module.exports.$inject = [ 'USER', 'socket' ];