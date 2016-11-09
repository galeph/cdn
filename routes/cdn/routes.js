const collapse = require('bundle-collapser/plugin');
const sass = require('node-sass');
const mime	= require('mime');
const childProcess = require('child_process').spawn;
const browserify = require('browserify');
const request = require('request');

const time = 31104000;
const min = /[_-]min/i;
const jss = /(css|swf|map|otf|eot|svg|ttf|woff|woff2)$/i;
const not = /(?:Gruntfile|gulpfile|conf|example|demo|support|specs|builder|bin|readme|src|test|scss|\.\.)/i;

const regex = {
	apodo: /^[a-z]{1}[a-z0-9_-]{3,13}[a-z|0-9]{1}$/i,
	admin: /^(?:[a-z|0-9]{40,40})$/i,
	render : /^(?:[a-z|0-9]{6,6})$/i,
	nit: /^[a-z|0-9|_|-]{16}$/i,
	tamano: /^[0-9]{0,4}x[0-9]{0,4}$/i,
	id: /^(?:[a-f|0-9]{24})$/i,
	img : /^(jpg|gif|png|ico)$/
};

function existFile (req, res, next, valor, name){
	var reg = regex[ name ];
	var test = !_.isEmpty( valor ) && reg.test( valor ) ? null : 'route' ;
	next( test );
}

function file (req, res, next, valor, name ){
	req.params[ name ] = ( new Buffer(req.params[ name ], 'hex' ) ).toString('utf8');
	next();
}

var renderCSS = function (scr, out, cb){
	sass.render({
		file : scr,
		noLineComments: false,
		//sourceMap : out + '.map',
		//sourceComments : 'map',
		//imagePath :
		outputStyle: GLOBAL.packages.env.compress.css ? 'compressed' : 'nested',
		includePaths : [
			path.join(process.env.DATA_DIR, 'stylesheets', 'lib' ),
			path.join(process.env.DATA_DIR, 'stylesheets', 'contrib' )
		]
	}, function (err, result) {
		if(err)
			return cb(err);

		fs.writeFile(out, result.css.toString().replace(/\}/g, '} '), 'utf8', function (err) {
			cb(err || out);
		});
	});
};

var renderJS = function (raw, js, cb) {
	var b = browserify({
		entries: [ raw ],
		basedir: GLOBAL.path.join( process.env.DATA_DIR, 'scripts'),
		detectGlobals : true
	});

	function writes (err, data) {
		if(err) return cb(err);

		fs.writeFile(js, data.toString().replace(/\n|\t/gm, ''), function (err) {
			cb(err || js);
		});
	}

	try{
		b
			.plugin(collapse)
			.transform({
				global: GLOBAL.packages.env.compress.js,
				compress: GLOBAL.packages.env.compress.js,
			}, 'uglifyify')
			.bundle(writes);
	}catch(e){
		cb(e);
	}
};

module.exports.change = function (is) {
	const nfile = GLOBAL.path.join( process.env.DATA_DIR, 'scripts', 'api', 'config.json');
	var startDate = moment();
	function start (next) {
		var data = require( nfile );
		request('https://' + GLOBAL.packages.env.domain.api + '/app', function (error, response, body) {
			startDate = moment();
			try{
				var jsn = JSON.parse(body);
				if(data.name === jsn.name && jsn.file === data.file)
					return next();

				data.name = jsn.name;
				data.file = jsn.file;

				fs.writeFile(nfile, JSON.stringify(data, null, '\t'), function (err) {
					next(err);
				});
			}catch(e){
				next(e);
			}
		});
	}

	return function (req, res, next) {
		var reStart = new Date()
		if ( moment().diff(startDate, 'h') || is )
			return start(next);

		next();
	};
};

module.exports.cache = function (req, res, next) {
	var cc = '';
	if(time) cc += 'max-age=' + time + ',';
	res.setHeader('Expires', moment().add(time, 'ms').toString() );
	res.setHeader('Cache-Control', cc + 'no-transform' );
	res.setHeader('X-Cache', 'HIT');
	next( 'GET' != req.method && 'HEAD' != req.method ? new Error( 'Invalid Method' ) : null );
};

module.exports.component = function (req, res, next){
	var libr = new Buffer( req.params.lib, 'hex' ).toString('utf8');
	var test = _.isEmpty(req.params[0]) || !jss.test(req.params[0]) || not.test(req.params[0]) || not.test(libr);
	if (('GET' != req.method.toUpperCase() && 'HEAD' != req.method.toUpperCase()) || test )
		return next(new Error('Not Found'));
	async.map(process.mainModule.paths, function (uis, otro) {
		var file = path.join(uis, _.dasherize(libr), req.params[0]);
		fs.exists(file, function (exist) {
			otro( exist ? file : null );
		});
	}, function (err, results){
		if(err)
			return next(err);
		var file;
		for (var i = results.length - 1; i >= 0; i--) 
			if(results[i]) file = results[i];

		next(file || new Error('No exist the file'));
	});
};

module.exports.CSS = function (req, res, next){
	if ( ('GET' != req.method.toUpperCase() && 'HEAD' != req.method.toUpperCase() ) || not.test(req.params.file) )
		return next(new Error('Not Found'));
	var file = req.params.file.replace(min, '');
	var scssPath = path.join( process.env.DATA_DIR, 'stylesheets', file + '.scss' );
	var cssPath = path.join(process.env.OPENSHIFT_TMP_DIR, file + '.css' );

	async.parallel({
		scss : function(callback){
			fs.stat(scssPath, callback);
		},
		css : function(callback){
			fs.exists(cssPath, function (exist) {
				if(exist)
					return fs.stat(cssPath, callback);
				callback();
			});
		}
	}, function (err, reslt){
		if(err && _.isEmpty(reslt.scss) )
			return next(err);
		
		if ( _.isEmpty(reslt.css) || reslt.scss.mtime > reslt.css.mtime || req.start )
			return renderCSS(scssPath, cssPath, next );

		next(cssPath);
	});
};

module.exports.IMG = function (req, res, next){
	if (('GET' != req.method.toUpperCase() && 'HEAD' != req.method.toUpperCase()) || /\.\./.test(req.params.name) )
		return next(new Error('Not Found'));
	var com = GLOBAL.path.join(process.env.DATA_DIR, 'images', req.params.file.split('-')[0] + '.' + req.params.img );
	
	fs.stat(com, function (err, exists){
		if(err) return next(new Error('No exist file'));
		res.header('Last-Modified', moment(exists.mtime).toString() );
		//  '-depth', 10, '-colors', 50,
		var convert = childProcess('convert', [ com, '+dither', '-resize', req.params.file.split('-')[1], '-' ]);
		res.contentType( mime.lookup(com) );
		convert.stdout.pipe( res );
	});
};

module.exports.JS = function (req, res, next) {
	if ( ('GET' != req.method.toUpperCase() && 'HEAD' != req.method.toUpperCase() ) || /\.\./.test(req.params.file) )
		return next(new Error('Not Found'));
	var file = req.params.file.replace(min, '').split('-');
	var InPath = GLOBAL.path.join( process.env.DATA_DIR, 'scripts', file[0], ( file[1] || 'index' ) + '.js' );
	var OutPath = GLOBAL.path.join(process.env.OPENSHIFT_TMP_DIR, file.join('.') + '.js' );
	async.parallel({
		ins : function(callback){
			fs.stat(InPath, callback);
		},
		out : function(callback){
			fs.exists(OutPath, function (exist) {
				if(exist)
					return fs.stat(OutPath, callback);
				callback();
			});
		}
	}, function (err, reslt){
		if(err && _.isEmpty(reslt.ins) )
			return next(err);

		if ( _.isEmpty(reslt.out) || reslt.ins.mtime > reslt.out.mtime  || req.start)
			return renderJS(InPath, OutPath, next );
		
		next(OutPath);
	});
};

module.exports.params = function(app) {
	app.param(_.allKeys(regex), existFile );
	app.param('file',	file );

	return app;
};

module.exports.send = function (file, req, res, next) {
	if( util.isError(file) || !_.isString(file))
		return next( util.isError(file) ? file : new Error(file.toString().replace(/error(\s)?:/i, '') ) );

	fs.stat(file, function (err, exists){
		if(err || !exists.isFile() )
			return next( err || new Error('Not exist file ' + file));
		res.header('Last-Modified', moment(exists.mtime).toString() );
		res.contentType( mime.lookup(file) );
		res.header('Content-Length', exists.size );
		var stream = fs.ReadStream( file );
		stream.setMaxListeners(0);
		//res.on('close', stream.destroy );
		stream.pipe( res );
	});
};

module.exports.dontFound = function (req, res) {
	if(util.isError(req))
		return next( req );

	res.redirect('https://'+  GLOBAL.packages.env.domain.error + '/?with=cdn');
};

module.exports.error = function (req, res) {
	res.redirect('https://'+  GLOBAL.packages.env.domain.error + '/?with=cdnt&error=' + data.toString() );
};