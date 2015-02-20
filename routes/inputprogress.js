var data = require('../fakedata.json');

exports.html = function(req, res){
  res.render('inputprogress', data);
};