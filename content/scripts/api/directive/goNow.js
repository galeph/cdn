module.exports = function (win) {
	return {
		restrict: 'A',
		link : function(scope, elez, attrs) {
			elez.on('click', function () {
				win.location = attrs.href;
			});
		}
	};
};

module.exports.$inject = [ '$window' ];