var data = require('../fakedata.json');

exports.html = function(req, res){
  req.session.userEmail = req.body.email;
  res.send();
};