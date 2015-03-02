var models = require('../models');

exports.html = function(req, res) {
	var name = req.session.name;

	if(typeof name == 'undefined') {
		res.redirect('/login');
	}
	else {
		var users = {
			"name" : name
		};

		res.render('help', { "users" : users });
	}
}

exports.newaccount = function(req, res) {
	var name = req.session.name;

	if(typeof name == 'undefined') {
		res.redirect('/login');
	}
	else {
		var users = {
			"name" : name
		};

		res.render('newhelp', { "users" : users });
	}
}

exports.indexhelp = function(req, res) {
	res.render('indexhelp');
}