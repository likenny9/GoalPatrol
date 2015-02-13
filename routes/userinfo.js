var fileSystem = require('fs');
var users = require('../users.json');

exports.html = function(req, res) {

	var userInfo = req.body;
	var newJson = users;
	newJson.members = userInfo;
	newJson = JSON.stringify(newJson);

	fileSystem.writeFile('users.json',newJson, function(err) {

		if(err) {
			console.log("User info not saved.");
			res.redirect('createaccount');
		}
		else {
			console.log("User info saved.");
			res.redirect('sendgoal');
		}
	});
}