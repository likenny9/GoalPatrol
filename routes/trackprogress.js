var models = require('../models');

exports.html = function(req, res){
	var sessionUser = req.session.userEmail;
	var goalInfoID = req.params.goalInfoID;
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

			models.Patrol
				.find({ "_id" : goalInfoID})
				.exec(patrolInfo);

			//Tracking own progress or patrols?
			function patrolInfo(err, patrol) {
				if(patrol[0].user == req.session.myid) {
					renderMyTrackProgress();
				}
				else {
					models.User
						.find({ "_id" : patrol[0].user})
						.exec(patrolUser);

					function patrolUser(err, patrolPerson) {
						renderPatrolTrackProgress(patrolPerson);
					}
				}
			}

			function renderMyTrackProgress() {
				res.render('trackprogress', { 'users': users, 'progress' : newProgress, 'partial' : partial });
			}

			function renderPatrolTrackProgress(patrol) {
				res.render('patrolprogress', { 'users': users, 'patrols': patrol, 'progress' : newProgress, 'partial' : partial });
			}
		}
	}
};