function setting(mod, send, params, session, dialog, log){
	this.dialog = dialog;
	this.params = params;
	this.send = send;

	that.dia = null;
	that.tab = {};
	that.acc = {};
	if( !this.params.tab ) this.params.tab = 'account';
	if( this.params.tab ) this.tab[ this.params.tab ] = true;
	this.url = session + '.settings-' + this.params.tab;
	this.send.on('test', function (w) {
		log.warn(w);
	});
	mod.ready();
}

setting.prototype.save = function() {
	that.dia = this.dialog.open({
		template: 'saves',
		className: 'ngdialog-theme-plain',
		scope: this,
	});
};

setting.prototype.senw = function() {
	var clonet = angular.copy(this.acc);
	if(this.params.tab === 'password') this.acc = {};
	clonet.type = this.params.tab;
	this.send.emit('change:settings', clonet);
	if( this.dia ) this.dia.close();
};

setting.prototype.saveProfile = function() {
	var data = angular.copy(this.profile);
	data.type = 'profile';
	this.send.emit('change:settings', data);
	if( this.dia ) this.dia.close();
};

setting.prototype.resetProfile = function() {
	this.profile = angular.copy(this.reset);
};

setting.$inject = [ '$scope', 'socket', '$routeParams', 'SESSION', 'ngDialog', '$log' ];


module.exports = setting;