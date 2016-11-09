var connect = require('../../db').internal();

module.exports.remove = function (email, callback) {
	connect
		.email
		.destroy({where: { mail: email} })
		.then(function (project) {
			callback();
		})
		.catch(callback );
};

module.exports.add = function (email, callback) {
	connect
		.email
		.findOrCreate({where: { mail: email} })
		.spread(function(user, created) { 
			callback(null, created);
	});
};

module.exports.get = function (query, callback) {
	connect
		.email
		.findAll(query)
		.then(function (doc) {
			callback(null, doc);
		})
		.catch(callback);
};