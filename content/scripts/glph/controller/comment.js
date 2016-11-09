var num = require('api').comment;

function comment (params, socket) {
	this.soc = socket;
	this.newComment = {
		text : '',
		send : params.id && params.id.length === 16
	};
}

comment.prototype.number = function() {
	return num - this.newComment.text.length;
};

comment.prototype.check = function() {
	return num - this.newComment.text.length >= 0 ? '' : 'error' ;
};

comment.prototype.delete = function(id, img) {
	this.soc.emit("yourImg", { act : 'del', img : img, id : id });
};

comment.prototype.send = function() {
	this.newComment.item = this._id;
	if( this.newComment.text.length <= num ){
		this.soc.emit('add:comment', this.newComment);
		this.newComment.text = '';
	}
};


module.exports.$inject = ['$routeParams', 'socket'];