var maxDB = require('./max');
var URI_PACK = path.join(process.env.DATA_DIR, 'data', 'mail.json');

module.exports = {
	removeEmail : function (req, res, next) {
		var sm = req.body.mail || req.query.mail || '';
		GLOBAL.async.map(sm.split(','), maxDB.remove, function (err, doc) {
			res.json({
				error : err,
				out : doc,
				body : req.body
			});
		});
	},
	addEmail : function (req, res, next) {
		var sm = req.body.mail || req.query.mail || '';
		GLOBAL.async.map(sm.split(','), maxDB.add, function (err, doc) {
			res.json({
				error : err,
				out : doc,
				body : req.body
			});
		});
	},
	sentCampain : function (req, res, next) {
		console.log(req.body, req.query);
		if(_.isEmpty(req.body) || _.isEmpty(req.body.data) )
			return next(new Error('Dont email'));

		var pack = require(URI_PACK);
		pack.send = req.body.data.status == 'sent';
		pack.campain = req.body.data.id;
		pack.subject = req.body.data.subject;

		fs.writeFile(URI_PACK, JSON.stringify(pack, null, '\t'), function (err) {
			res.json({
				error : err,
				ok : true,
				body : req.body
			});
		});
	},
	delEmail :  function (req, res, next) {
		maxDB.remove(req.body.sender, function (err, doc) {
			res.json({
				err : err,
				doc :  doc
			});
		});
	},
	getEmail : function (req, res, next) {
		if(!req.query.offset)
			req.query.offset = 0;
		if(!req.query.limit)
			req.query.limit = 10000;

		var data = [];

		maxDB.get(req.query, function (err, doc) {
			var docs = doc || [];
			for (var i = docs.length - 1; i >= 0; i--) {
				data.push(docs[i].get({
					plain: true
  				}));
			}

			res.json({
				err : err,
				doc : data
			});
		});
	}
};