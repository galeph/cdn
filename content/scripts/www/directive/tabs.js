module.exports = function (win) { 
	return {
		restrict: 'C',
		//bindToController: true,
		link : function(scope, elez, attrs) {
			scope.$watch(function (argument) {
				return win.matchMedia('screen and (max-width: 960px)').matches;
			}, function (newValue) {
				if(newValue){
					elez.removeClass('flex');
					elez.removeClass('left');
					elez.addClass('top');
				} else{
					elez.addClass('flex');
					elez.addClass('left');
					elez.removeClass('top');
				}
			});
		}
	};
};

module.exports.$inject = ['$window'];