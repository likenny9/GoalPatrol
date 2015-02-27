/** Module dependencies **/

var express = require('express');
var handlebars = require('express3-handlebars');
var mongoose = require('mongoose');
var googleCal = require('google-calendar');
var googleAuth = require('passport-google-oauth').OAuth2Strategy;
var passport = require('passport');
var config = require('./config');

var http = require('http');
var path = require('path');

//Mongoose
var local_DB_name = 'GoalPatrol';
var local_DB_uri = 'mongodb://localhost/' + local_DB_name;
var dB_uri = process.env.MONGOLAB_URI || local_DB_uri;
mongoose.connect(dB_uri);

//Add requires for pages here
var home = require('./routes/home');
var patrolInfo = require('./routes/patrolInfo');
var setgoal = require('./routes/setgoal');
var index = require('./routes/index');
var login = require('./routes/login');
var trackprogress = require('./routes/trackprogress');
var inputprogress = require('./routes/inputprogress');
var settings = require('./routes/settings');
var sendgoal = require('./routes/sendgoal');
var help = require('./routes/help');
var createaccount = require('./routes/createaccount');
var goaldetails = require('./routes/goaldetails');
var history = require('./routes/history');

//Add requires for ajax calling here
var userinfo = require('./routes/userinfo');
var authenticate = require('./routes/authenticate');
//var saveSession = require('./routes/saveSession');
//var insertProgress = require('./routes/insertProgress');
//var patrol = require('./routes/patrol');

//Creates express app
var app = express();
var hbs;

//Allows access to another domain 
var CORS = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

/* Google Calendar */

app.configure(function() {
  app.use(CORS); //cross domain
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.session({ secret: 'cogs120 sk' }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
});

passport.use(new googleAuth({
	clientID: config.consumer_key,
	clientSecret: config.consumer_secret,
	callbackURL: "http://goalpatrol2.herokuapp.com/auth/callback",
	scope: ['openid', 'email', 'https://www.googleapis.com/auth/calendar']
},
function(accessToken, refreshToken, profile, done) {
	profile.accessToken = accessToken;
	return done(null, profile);
}
));



app.get('/auth', passport.authenticate('google', { session: false }));
app.get('/auth/callback', 
	passport.authenticate('google', { session: false, failureRedirect: '/goaldetails' }),
	function(req, res) {
		req.session.access_token = req.user.accessToken;
		res.redirect('/goaldetails');
	});


//Uses calendar ID to add JSON formatted input to calendar
app.all('/:calendarId/add', function(req,res) {
 	if(!req.session.access_token) return res.redirect('/auth');

  	var accessToken     = req.session.access_token;
    var google_calendar = new googleCal.GoogleCalendar(accessToken);
 	var calendarId      = req.params.calendarId;

 	var calendarEvent = req.session.info;
 	console.log(calendarEvent);

  	google_calendar.events.insert(calendarId, calendarEvent, function(err, data) {
    	if(err) {
    		console.log(err);
    		return res.send(500,err);
    	}
    	return res.redirect('/goaldetails');
  	});
});


//Gets the calendar ID
app.all('/getCalendarID', function(req, res){
 	if(!req.session.access_token) return res.redirect('/auth');

  	var accessToken     = req.session.access_token;
    var google_calendar = new googleCal.GoogleCalendar(accessToken);
 	var calendarId;
	var calendarList    = google_calendar.calendarList.list(function(err,data) {
    	if(err) {
    		console.log(err);
    		return res.send(500,err);
    	}
    	
    	calendarId = data.items[0].id;
    	req.body = req.session.info;
    	return res.redirect('/' + calendarId + '/add');
	});

});

//Obtains the calendar request
app.post('/addToCalendar', function(req,res) {
	req.session.info = req.body;
	res.redirect('/getCalendarID');
});

/* End Google Calendar */


/* Custom Handlebars Helpers */

hbs = handlebars.create({
  partialsDir: 'views/partials/',
  helpers: {
    compare: function(lvalue, rvalue, options) {
     
      if (arguments.length < 3)
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
   
      operator = options.hash.operator || "==";
      
      var operators = {
        '==':   function(l,r) { return l == r; },
        '===':  function(l,r) { return l === r; },
        '!=':   function(l,r) { return l != r; },
        '<':    function(l,r) { return l < r; },
        '>':    function(l,r) { return l > r; },
        '<=':   function(l,r) { return l <= r; },
        '>=':   function(l,r) { return l >= r; },
        'typeof': function(l,r) { return typeof l == r; }
      }
   
      if (!operators[operator])
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);
   
      var result = operators[operator](lvalue,rvalue);
   
      if( result ) {
        return options.fn(this);
      } 
      else {
        return options.inverse(this);
      }
    }
  }  
});

//Loads all files in the view/partials directory
hbs.loadPartials(function(err,partials) {
  hbs.handlebars.partials = partials;
});
  
  /* End Handlebars */

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

/** App environments **/
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars',hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

//Add routes here
app.get('/', home.html); //Home Page
app.get('/:id/:myid', patrolInfo.yourGoalForPatrol);
//app.get('/patrol/:id/:myid', patrol.yourGoalForPatrol);
app.get('/setgoal', setgoal.html); //setgoal
app.get('/index', index.html);
app.get('/login', login.html);
app.get('/trackprogress/:goalInfoID/track', trackprogress.html);
app.get('/inputprogress', inputprogress.html);
app.get('/settings', settings.html);
app.get('/sendgoal', sendgoal.html);
app.get('/help', help.html);
app.get('/createaccount', createaccount.html);
app.get('/goaldetails', goaldetails.html);
app.get('/history', history.html);

//Json routes
app.all('/insertUserInfo', userinfo.html);
//app.all('/saveSessionEmail', saveSession.html);
//app.all('/insertProgressInfo', insertProgress.html);
app.all('/authenticate', authenticate.login);
app.all('/createUserInfo', authenticate.create);
app.all('/getUsers', authenticate.getUsers);
app.all('/checkAlreadyHaveGoal', authenticate.checkAlreadyHaveGoal);
app.all('/saveGoal', authenticate.saveGoal);
app.all('/deleteGoal', authenticate.deleteGoal);
app.all('/saveGoalID', authenticate.saveGoalID);
app.all('/getGoalID', authenticate.getGoalID);
app.all('/removeGoalWaiting', authenticate.removeGoalWaiting);
app.all('/insertProgressInfo', authenticate.insertProgress);
app.all('/logout', authenticate.logout);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});