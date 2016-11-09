function upload (mods, socket, win, time) {
	var fileReader = new win.FileReader();
	this.imageData = '';
	this.m = mods;
	fileReader.onload = this.onload;

	if (this.card.isImage()) {
		fileReader.readAsDataURL(this.card.file);
	}

	go.emit('add:item', this.card.file.bind(this));
}

upload.prototype.onload = function(event) {
	var that = this;
	this.m.$apply(function () {
		that.imageData = event.target.result;
	})
};

upload.prototype.delete = function() {
	this.card.deleteFile();
	var index = this.$index;
	if(index >= 0 )
		mods.model.splice( index, 1 );
};

upload.$inject = [ '$scope', 'socket', '$window', '$timeout' ]

module.exports = upload;