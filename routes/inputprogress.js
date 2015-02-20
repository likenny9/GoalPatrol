var data = require('../fakedata.json');

exports.html = function(req, res){

  function getMonthInWords(num) {
	  var month = new Array(12);
	  month[0]=  "January";
	  month[1] = "February";
	  month[2] = "March";
	  month[3] = "April";
	  month[4] = "May";
	  month[5] = "June";
	  month[6] = "July";
	  month[7]=  "August";
	  month[8] = "September";
	  month[9] = "October";
	  month[10] = "November";
	  month[11] = "December";
	  return month[num];
	}

	var today = new Date();
	today = getMonthInWords(today.getMonth()) + " " + today.getDate() + ", " + today.getFullYear();
	data['date-today'] = today;

  res.render('inputprogress', data);
};