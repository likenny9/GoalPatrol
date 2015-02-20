var data = require('../fakedata.json');

//Render Home HTML Page
exports.html = function(req, res){
  res.render('login',data);
};
