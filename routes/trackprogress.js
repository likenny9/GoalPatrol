var models = require('../models');

exports.html = function(req, res){
	var sessionUser = req.session.userEmail;
	var goalInfoID = req.params.goalInfoID;
	var name = req.session.name;

	var users = {
		"name" : name
	};

	if(typeof sessionUser == 'undefined') {
		res.redirect('/login');
	}
	else {
		models.Progress
			.find({ "patrol" : goalInfoID })
			.sort("-date")
			.exec(foundProgress);

		function foundProgress(err, progress) {
			var newProgress = [];

			for(var i=0; i < progress.length; i++) {
				var newJson = {
					"date" : progress[i].date.toDateString(),
					"difficulty" : progress[i].difficulty,
					"experience" : progress[i].experience,
					"satisfaction" : progress[i].satisfaction,
					"stress" : progress[i].stress,
					"comments" : progress[i].comments,
					"patrol" : progress[i].patrol
				}
				newProgress.push(newJson);
			}
			res.render('trackprogress', { 'users': users, 'progress' : newProgress });
		}
	}
};