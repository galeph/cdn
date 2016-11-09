module.exports =function (mod, go, dialog, method, location, ses, urlx, win) {
	var that = this;
	that.methods = method.get();
	that.send = false;
	that.card = {};
	that.data = {};

	that.onLoad = function (event) {
		that.card.pocress = false;
	};
	
	that.onBack = function (event) {
		if (event.origin == 'https://www.coinbase.com') {
			var eventType = event.data.split('|')[0];
			if (eventType == 'coinbase_payment_complete')
				location.path(urlx.replace('api', 'shop') + event.id );
		}
	};

	that.execPay = function () {
		that.card.system = ev.system;
		that.card.pocress = true;
		go.emit('shop:exec', that.card );
	};

	go.on('view:checkin', function (data) {
		if(data.redirect)
			return win.location.href = data.url;

		that.data = data;
		dialog.open({
			template: urlx + ses + '.in-' + that.methods[ that.sistem ].name,
			className: 'ngdialog-theme-plain',
			scope: that
		});
	});

	that.total = function(){
		var total = 0;
		for (var i = mod.$parent.items.length - 1; i >= 0; i--)
			total += mod.$parent.items[i].sell.price ;

		return total;
	};

	that.checkout = function () {
		if(!that.send){
			that.send = true;
			go.emit('add:shop:checkin', that.methods[that.sistem].name);
		}
	};

	that.size = function () {
		var len = that.methods.length;
		return parseInt( 100 / len );
	};

};

module.exports.$inject = [ '$scope', 'socket', 'ngDialog', 'pay', '$location', 'SESSION', 'URL', '$window' ];
