/*
 * GET home page. 
 */

const route = require('./routes');

var app = express();

app.set('url',   GLOBAL.packages.env.domain.cdn);

app = route.params(app);
app.use(route.cache);
app.use(route.change());
app.set('x-powered-by', false);
app.all('/lib/:render.:lib/*',	route.component, route.send );
app.all('/css/:render.:file.css', route.CSS, route.send );
app.all('/js/:render.:file.js', route.JS, route.send );
app.all('/:img/:render.:file.:img', route.IMG );

app.use(route.dontFound);
app.use(route.error);

module.exports = app;
