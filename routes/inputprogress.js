var models = require('../models');

exports.html = function(req, res){
	var sessionUser = req.session.userEmail;
	var goalInfoID = req.session.goalID;
	var name = req.session.name;
	var partial = req.session.partial;

	var users = {
		"name" : name
	};

	if(typeof sessionUser == 'undefined') {
		res.redirect('/login');
	}
	else {
		models.Progress
			.find({ "patrol" : goalInfoID })
			.exec(foundProgress);

		function foundProgress(err, progress) {
			var newProgress = [];
			var today = new Date().toDateString();

			for(var i=0; i < progress.length; i++) {
				if(today == progress[i].date.toDateString()) {
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
			}

			res.render('inputprogress', { 'users': users, 'progress' : newProgress, 'partial' : partial });
		}
	}	
};