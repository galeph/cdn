function item (mod, socket, params, nam, ses, api, dialog, prop){
	this.soc = socket;
	this.dialog = dialog;
	this.api = api;
	this.ses = ses;
	this.prop = prop;

	if(!this.card) this.card = {};
	
	if(this.card.file && !this.card.send){
		this.card.send = true;
		this.card.isNew = true;
		this.soc.emit('add:item:start', {
			size : this.card.size,
			type : this.card.type,
			date : this.card.updatedAt,
			file : this.card.file,
			index : this.card.$$hashKey
		});
	} else {
		if(!this.card.table){
			this.rep = { data : { email : '' }, send : 0 };
			var that = this;
			mod.$watch(function () {
				return this.rep.selector;
			}, function(mVal){
				that.rep.data.message = mVal != 'other' ? mVal : null;
			});	
		}
	}

	if( this.card.table && angular.isArray(this.card.table) && nam === 'shop' ){
		this.card.select = false;
		this.table = [];
		for (var i = this.card.table.length - 1; i >= 0; i--) {
			var z = this.table.length;
			while (z >= 0 ){ // TODO Eso debe venir asi desde DB
				if( this.table[z - 1] && this.table[z - 1].price === this.card.table[i].item ){
					this.table[z - 1].items++;
					z = 0;
				} else if (z === 0) {
					this.table.push({
						price : this.card.table[i].item,
						items : 1
					});
				}
				z--;
			}
		}
	}

	if(!angular.isDefined(this.card.sell)){
		this.card.sell = false;
	}

	this.soc.on('add:item:ok', function (doc) {
		if( doc.index === this.card.$$hashKey){
			angular.extend(this.card, doc);
			soc.emit('add:item:upload', {
				index : this.card.$$hashKey,
				file : this.card.file
			});
		}
	});	

	this.soc.on('add:item:final', function (doc) {
		if( doc.index === this.card.$$hashKey){
			angular.extend(this.card, doc);
			this.card.percent = 100;
			this.card.send = false;
		}
	});

	this.soc.on('add:item:porcent', function (doc) {
		if( doc.index === this.card.$$hashKey){
			angular.extend(this.card, doc);
		}
	});
}

item.prototype.update = function(pull) { // a( ng-click="item.update(timeline.pull)" )
	this.card.edit = false;
	this.card.menu = false;
	var it = angular.copy(this.card);
	delete it.body;
	delete it.file;
	this.soc.emit('change:item', it); // Sube informacion
	if( this.card.isNew ) pull( this.card, 'more' );
};

item.prototype.addProfile = function(typz) {
	this.soc.emit('change:settings', { send : this.card._id, type : typz });
};

item.prototype.addCart = function(first_argument) {
	this.soc.emit('add:shop:cart', this.card._id);
};

item.prototype.removeCart = function(pull) { // a( ng-click="item.select(timeline.pull)" )
	this.soc.emit('del:shop:cart', this.card._id);
	pull( this.card, 'items' );
};

item.prototype.delete = function() {
	this.soc.emit('delete:item', this.card);
};

item.prototype.select = function(callback) { // a( ng-click="item.select(timeline.go)" )
	callback[ this.card.select ? 'pull' : 'select' ](this.card, 'more' );
	this.card.select = !this.card.select;
};

item.prototype.favorite = function() {
	this.soc.emit('change:favorite', { is : !this.isFavorite, id : this.card._id });
};

item.prototype.like = function() {
	this.card.isLike = !this.card.isLike;
	this.card.likes = this.card.isLike ? this.card.likes + 1 : this.card.likes - 1;	
	this.soc.emit('change:like', { is : this.card.isLike, id : this.card._id });
};

item.prototype.report = function() {
	this.dialog.open({
		template : this.api.replace('api', 'www') + this.ses + '.report',
		scope : this,
		className: 'ngdialog-theme-plain',
	});
};

item.prototype.reportSend = function() {
	delete this.rep.error;
	this.rep.send = 1;
	var that = this;
	that.prop.send(that.card._id, that.rep.data, function () {
		that.rep.send = 2;
		that.dialog.closeAll();
	}, function (err) {
		that.rep.send = 0;
		that.rep.error = err;
	});
};

item.$inject = [
	'$scope',
	'socket',
	'$routeParams',
	'NAME',
	'SESSION',
	'API',
	'ngDialog',
	'prop'
];

module.exports = item;