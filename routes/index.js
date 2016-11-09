var app = express();
var data = fs.readFileSync(path.join(process.env.DATA_DIR, 'data', 'slides-deck.html' ), 'utf-8');

const bodyParser = require('body-parser');
const ghost = require('ghost');
const vhost = require('vhost');
const rout = require('./maker/mails');

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.raw());

app.set('x-powered-by', false);
app.set('query parser', require('node-qs-serialization').deparam );
app.use(require('serve-favicon')(path.join(process.env.DATA_DIR, 'images', 'favicon.ico')) );
app.use(function (req, res, next){
	res.setHeader('Access-Control-Allow-Origin', req.headers.origin ||  '*' );
	next();
});

//app.use(require('morgan')(':method :url :status :response-time ms - :res[content-length]'));
// https://[Your-domain-master]/34129650ae3c80/add
app.all('/' + GLOBAL.packages.env.id + '/cribe', rout.removeEmail);
app.all('/' + GLOBAL.packages.env.id + '/campa', rout.sentCampain);
app.all('/' + GLOBAL.packages.env.id + '/add',  rout.addEmail);
app.all('/' + GLOBAL.packages.env.id + '/dels',  rout.delEmail);
app.all('/' + GLOBAL.packages.env.id + '/get',  rout.getEmail);

[
	require('./maker'),
	require('./cdn')
	//require('./sender'),
].forEach(function (item) {
	app.use(vhost(item.get('url'), item));
});

app.use('/slide', function (req, res) {
	res.send(data);
});

ghost({
	config: path.join(__dirname, 'blog', 'index.js')
}).then(function (ghostServer) {
	app.use(ghostServer.config.paths.subdir, ghostServer.rootApp);
	ghostServer.start(app);
}).catch(function (err) {
	console.log(err.message, err.stack);
});

module.exports = app;