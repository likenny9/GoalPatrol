var Mongoose = require('mongoose');

var UserSchema = new Mongoose.Schema({
	"name" : String,
	"email" : String,
	"password" : String,
	"profilepic" : String
});

var PatrolSchema = new Mongoose.Schema({
	"pname" : String,
	"pprofilepic" : String,
	"goal" : String,
	"hoursweek" : Number,
	"timesweek" : Number,
	"motivations" : [String],
	"goalwaiting" : String,
	//the user this person is patrolling
	"user" : [{ type: Mongoose.Schema.ObjectId, ref: 'User' }],
	//if pname is Kenny, this is his ID 
	"myid" : [{ type: Mongoose.Schema.ObjectId, ref: 'User' }] 		
});

var ProgressSchema = new Mongoose.Schema({
	"date" : Date,
	"difficulty" : Number,
	"experience" : Number,
	"satisfaction" : Number,
	"stress" : Number,
	"comments" : String,
	"patrol" : [{ type: Mongoose.Schema.ObjectId, ref: 'Patrol' }]	
});

exports.User = Mongoose.model('User', UserSchema);
exports.Patrol = Mongoose.model('Patrol', PatrolSchema);
exports.Progress = Mongoose.model('Progress', ProgressSchema);

/*var ProjectSchema = new Mongoose.Schema({
	"date-today" : Date,
	"users" : [{
		"name" : String,
		"email" : String,
		"password" : String,
		"profilepic" : String,
		"patrol" : [{
			"pname" : String,
			"pprofilepic" : String,
			"goal" : String,
			"hoursweek" : Number,
			"timesweek" : Number,
			"motivations" : [{
				"1" : String
			}],
			"progress" : [{
				"date" : Date,
				"difficulty" : Number,
				"experience" : Number,
				"satisfaction" Number,
				"stress" : Number,
				"comments" : String
			}],
			"goalwaiting" : Boolean
		}]
	}]
});

exports.Project = Mongoose.model('Project', ProjectSchema);*/