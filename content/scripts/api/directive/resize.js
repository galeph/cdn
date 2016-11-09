module.exports =function (win, inter) {
	var d = win[0];
	return {
		restrict: 'A',
		link: function (scope, ele, attr) {
			inter(function (argument) {
				angular.element(ele).css({
					right : d.getElementById(attr.for)[ 'offset' + attr.right] + 'px',
				});
			}, 350);
		}
	};
};
module.exports.$inject = [ '$document', '$timeout' ];