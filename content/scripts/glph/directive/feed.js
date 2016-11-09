function feed (scope, ele, attrs, socket) {
	this.select = this.$parent.select;
	this.isDownload = false;
	this.isFavorite = false;
	this.isLike = false;
	this.send = false;
}




module.exports =function ( sock, time, ses, uis ){
	var crtl = [ '$scope', '$element', '$attrs', 'socket', function (scope, ele, attrs) {
		scope.select = scope.$parent.select;
		scope.isDownload = false;
		scope.isFavorite = false;
		scope.isLike = false;
		scope.send = false;

		function checks () {
			if( angular.isNumber(scope.isBay) ){
				if(scope.isBay === 1){
					scope.urlTo = scope.nick + '?to=download';
					scope.tipe = 'check';
				}else if(scope.isBay === 2){
					scope.urlTo = '/cart';
					scope.tipe = 'cart-plus';
				} else {
					scope.urlTo = '/report';
					scope.tipe = 'exclamation';
				}

			}
		}

		scope.favorite = function (){
			sock.emit('change:favorite', { is : !scope.isFavorite, id : scope._id });
		};

		scope.like = function (){
			scope.count = !scope.isLike ? scope.count + 1 : scope.count - 1;
			sock.emit('change:like', { is : !scope.isLike, id : scope._id });
		};

		scope.addCart = function(){
			sock.emit('add:shop:cart', scope._id);
		};

		sock.on('feedback', function (ms){
			if( scope._id === ms.how ){
				scope.isFavorite = !!ms.favo;
				scope.isLike = !!ms.like;
				if( angular.isNumber(ms.count) )
					scope.count = ms.count;

				if( angular.isDefined(ms.down) && ms.down)
					scope.isDownload = ms.down;
			}
		});

		if(!scope.send){
			sock.emit('view:feedback', scope._id);
			scope.send = true;
			checks();
		}
	}];

	return {
		restrict: 'A',
		scope : {
			'_id' : '@feedback',
			'isCart' : '=cart',
			'isBay' : '=bay',
			'nick' : '@'
		},
		controller: crtl,
		templateUrl : function(tElement, tAttrs) {
			return uis + ses + '.buttonmenu?is=' + tAttrs.shop;
		}
	};
};

module.exports.$inject = ['socket', '$timeout', 'SESSION', 'URL'];
