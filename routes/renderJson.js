var data = require('../fakedata.json');

exports.html = function(req, res){
	//Maybe only render the logged in user's details here
	res.json(data);
};
