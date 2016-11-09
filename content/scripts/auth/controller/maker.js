function maker (mod, captcha) {
	//this.patr = /^[a-z|0-9]{1}[a-z|0-9|_]{3,13}[a-z|0-9]{1}$/i;
	this.step = 0;
	mod.ready();
	this.reload = captcha.reload;
}

maker.prototype.nexts = function() {
	var isTrue = true;
	for (var i = this.step; i >= 0; i--)
		if( this.fox[i] ) isTrue = isTrue && this.create[ this.fox[i] ].$valid;
	if(isTrue) this.step++;
};

maker.prototype.back = function() {
	this.step--;
};

maker.prototype.classes = function() {
	var isTrue = true;
	for (var i = this.step; i >= 0; i--)
		if( this.fox[i] ) isTrue = isTrue && this.create[ this.fox[i] ].$valid;

	return isTrue ? 'green' : 'red';
};

maker.$inject = ['$scope', 'reCAPTCHA'];

module.exports = maker;