var http = require('http'),
    config = require('../config');

var options = {
  host: 'www1.toronto.ca',
  path: '/City_Of_Toronto/Information_&_Technology/Open_Data/Data_Sets/Assets/Files/greenPParking.json',
};

var totalBody = "";

http.get(options, function(res) {
	res.on('data', function (chunk) {
		totalBody += chunk;
	  });

	res.on('end', function() {
		var allLots = JSON.parse(totalBody);
		allLots.carparks.forEach(function(lot) {
			var toSave =  {
				address: lot.address,
				lat: parseFloat(lot.lat),
				lng: parseFloat(lot.lng),
				rate: lot.rate,
				rate_half_hour: lot.rate_half_hour,
				carpark_type: lot.carpark_type,
				carpark_type_str: lot.carpark_type_str,
				capacity: lot.capacity
			}
			postLotToAMS(toSave);
		});
	})
});


function postLotToAMS(lot) {

  // An object of options to indicate where to post to
  var post_options = {
      host: config.amsUrl,
      port: '80',
      path: '/tables/lots',
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-ZUMO-APPLICATION': config.amsApplicationKey
      }
  };

  // Set up the request
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log('posted: ' + chunk);
      });
  });

  // post the data
  post_req.write(JSON.stringify(lot));
  post_req.end();

}