const bodyParser = require('body-parser');
const rout = require('./routes');

var app = express();

app.set('url', 'l.galeph.com');
app.set('trust proxy', 1);
app.use(function (req, res, next){
	res.setHeader('Access-Control-Allow-Credentials', true);
	res.setHeader('Access-Control-Allow-Methods', 'X-Requested-With,POST,PUT,DELETE,GET');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,' + GLOBAL.packages.env.service);
	next();
});

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.raw());

// Is delete for segurity
// API For your app
 

app.use(function (req, res, next) {
	if(util.isError(req))
		return next( req );

	res.redirect('https://'+  GLOBAL.packages.env.domain.error + '/?with=about');
});

app.use(function (data, req, res, next) {
	console.log(data);
	res.redirect('https://'+  GLOBAL.packages.env.domain.error + '/?with=about&error=' + data.toString() );
});

module.exports = app;