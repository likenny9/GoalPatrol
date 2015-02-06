/** Module dependencies **/

var express = require('express');
var handlebars = require('express3-handlebars');
var http = require('http');
var path = require('path');

//Add requires for pages here
var home = require('./routes/home');
var setgoal = require('./routes/setgoal');
var index = require('./routes/index');
var login = require('./routes/login');
var trackprogress = require('./routes/trackprogress');
var settings = require('./routes/settings');
var sendgoal = require('./routes/sendgoal');
var help = require('./routes/help');
var createaccount = require('./routes/createaccount');

//Creates express app
var app = express();

/** App environments **/
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars',handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

//Add routes here
app.get('/', home.html); //Home Page
app.get('/setgoal', setgoal.html); //setgoal
app.get('/index', index.html);
app.get('/login', login.html);
app.get('/trackprogress', trackprogress.html);
app.get('/settings', settings.html);
app.get('/sendgoal', sendgoal.html);
app.get('/help', help.html);
app.get('/createaccount', createaccount.html);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});