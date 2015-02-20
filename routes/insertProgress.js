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
	newJson.users[i].patrol[1].progress.push(userInfo);
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