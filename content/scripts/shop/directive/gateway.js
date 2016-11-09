module.exports =function (){
	return {
		restrict: 'A',
		scope : {
			'callBack' : '&',
			'callLoad' : '&'
		},
		link : function (scope, element, attr, ctrl) {
			element.on('load', function(ev){
				return scope.callLoad(ev);
			});
			element.on('message', function(ev){
				return scope.callBack(ev);
			});
		},
	};
};

module.exports.$inject = [];