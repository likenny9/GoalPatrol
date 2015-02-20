var fileSystem = require('fs');
var users = require('../fakedata.json');

exports.html = function(req, res) {
	var userEmail = "k3li@ucsd.edu";//req.session.userEmail;
	var userInfo = req.body;
	var newJson = users;
	var i;

	for(i = 0; i < newJson.users.length; i++) {
		if(newJson.users[i].email == userEmail) {
			break;
		}
	}

	//Today is already in the JSON
	for(j = 0; j < newJson.users[i].patrol[1].progress.length; j++) {
		if(newJson.users[i].patrol[1].progress[j].date == userInfo.date) {
			break;
		}
	}
	if(j != newJson.users[i].patrol[1].progress.length) {
		if(newJson.users[i].patrol[1].progress[j].date == userInfo.date) {
			newJson.users[i].patrol[1].progress[j].difficulty = userInfo.difficulty;
			newJson.users[i].patrol[1].progress[j].experience = userInfo.experience;
			newJson.users[i].patrol[1].progress[j].satisfaction = userInfo.satisfaction;
			newJson.users[i].patrol[1].progress[j].stress = userInfo.stress;
			newJson.users[i].patrol[1].progress[j].comments = userInfo.comments;									
		}
	}
	else {
		newJson.users[i].patrol[1].progress.push(userInfo);		
	}

	newJson = JSON.stringify(newJson);

	fileSystem.writeFile('fakedata.json',newJson, function(err) {
		console.log(err);
		if(!err) {
			console.log("Done.");
		}
		else {
			console.log("Error inputting stuff.");
		}
	});
}