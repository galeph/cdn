module.exports =function () { 
	return {
		restrict: 'A',
		//bindToController: true,
		link : function(scope, elez, attrs) {
			scope._id = attrs.ngId;
			attrs.id = attrs.ngId;
		}
	};
};

module.exports.$inject = [];
