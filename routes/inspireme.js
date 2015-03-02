var models = require('../models');

exports.html = function(req, res){
	var goalInfoID = req.body.idToSave;

	models.Patrol
		.find({"_id" :goalInfoID})
		.exec(getInspirations);

	function getInspirations(err, patrol) {
		var motivations = patrol[0].motivations;
		var randomNum = Math.floor((Math.random() * motivations.length));
		res.send(motivations[randomNum]);
	}
};