module.exports =function (mod, soc, ses, urlx, method, dialog, win){
	var that = this;
	that.datas = { info : {}, review : '', items : [], method : '' };
	that.methods = method.send();

	that.total = function(){
		var total = 0;
		for (var i = mod.$parent.more.length - 1; i >= 0; i--){
			var its = mod.$parent.more[i];
			for (var j = its.table.length - 1; j >= 0; j--) {
				total += its.table[j].item;
			}
		}

		return total;
	};

	that.checkout = function () {
		soc.emit('add:shop:checkout', that.datas);
	};

	that.download = function () {
		dialog.open({
			template: urlx + ses + '.out-' + that.methods[ that.sistem ].name,
			className: 'ngdialog-theme-plain',
			scope: that
		});
		that.datas.items = mod.$parent.more;
		that.datas.method = that.methods[ that.sistem ].name;
	};

	that.isOk = function () {
		return that.total() > 25;
	};

	that.size = function () {
		var len = that.methods.length;
		return parseInt( 100 / len );
	};

	soc.on('add:checkout:ok', function (data) {
		win.location.href = data.success_url;
	});
};

module.exports.$inject =  ['$scope', 'socket', 'SESSION', 'URL', 'pay','ngDialog', '$window']; 