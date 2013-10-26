/*
	Some api info
	https://developer.foursquare.com/overview/versioning
*/
var request = require('request');
var fs = require('fs');
var url = "https://api.foursquare.com/v2";
var auth = "&client_id=V3GY4Q5T2H5LTERUNUEJ2HR5F541YCZDWN1IPETIKX1BS3Y1&client_secret=GKCG2MRHUVNQVSI1Z4ADIQIXCMANIAVA2LRL31MBEV5JD523";
// quite hard coded for now
var cache = [];


/*
https://api.foursquare.com/v2/venues/search?near=Singapore,Singapore
&client_id=V3GY4Q5T2H5LTERUNUEJ2HR5F541YCZDWN1IPETIKX1BS3Y1&client_secret=GKCG2MRHUVNQVSI1Z4ADIQIXCMANIAVA2LRL31MBEV5JD523

https://api.foursquare.com/v2/venues/explore?near=Berlin
&client_id=V3GY4Q5T2H5LTERUNUEJ2HR5F541YCZDWN1IPETIKX1BS3Y1&client_secret=GKCG2MRHUVNQVSI1Z4ADIQIXCMANIAVA2LRL31MBEV5JD523

https://api.foursquare.com/v2/venues/4adcda7df964a5206a4721e3?
&client_id=V3GY4Q5T2H5LTERUNUEJ2HR5F541YCZDWN1IPETIKX1BS3Y1&client_secret=GKCG2MRHUVNQVSI1Z4ADIQIXCMANIAVA2LRL31MBEV5JD523
*/

function explore(city, offset){
	//limit=50, offset=50
	var buf = [url, '/venues/explore?limit=50&near=', city, auth, '&v=20131026', '&offset=', offset];

	request.get(buf.join(''), function(e,r,b){
		var json = JSON.parse(b);
		var groups = json['response']['groups'];

		for(var i=0;i<groups.length;i++){
			var items = groups[i]['items'];
			for(var j=0;j<items.length;j++){
				//console.log("Butsers " + JSON.stringify(items[j]));

				var buf2 = [url, '/venues/', items[j]['venue']['id'], '/events', '?', auth, '&v=20131026'];
				//console.log(buf2.join(''));
				request.get(buf2.join(''), function(e,r,b){
					//{"meta":{"code":200},"response":{"events":{"count":0,"summary":"","items":[]}}}
					var json2 = JSON.parse(b);
					if (json2['response']['events']["count"]>0){
						var items = json2['response']['events']["items"];
						for(var k=0;k<items.length;k++){
							cache.push(items[k]);
						}
						console.log(cache.length);
					}
				});
			}
		}

		//console.log(JSON.stringify(json, null, 4));
		//console.log(json['response']['groups']);
	});
}

function init_cache(){
	explore("Berlin", 0);
	explore("Berlin", 50);
	explore("Berlin", 100);
	explore("Berlin", 150);
	explore("Berlin", 200);
	explore("Berlin", 250);

	setTimeout(write_cache, 30000);
}

function write_cache(){
	var outfile = "./cached.json";
	fs.writeFile(outfile, JSON.stringify(cache, null, 4), function(err){
		if(err){
			console.log("Ups " + err);
		}
	});
}

init_cache();