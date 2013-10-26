/*
	Welcome to the awesome Zalando node js api

	http://disrupt-hackathon.zalando.net/manual/hackathon-api-book-1.0.html#d0e26
	http://disrupt-hackathon.zalando.net/categories/www.zalando.de

	/search/<domain-url>/<category-url-key>
	In this template, the <category-url-key> should be the URL key of a valid category.
	Example 2.15. Search operation over category and brand template
	/search/<domain-url>/<category-url-key>/<brand-url-key>
*/
var restler = require('restler');
var request = require('request');
var fs = require('fs');

var url = "http://disrupt-hackathon.zalando.net";
//var domain = "www.zalando.de";
var domain = "www.zalando.co.uk";
var options = {headers: {'Accept': 'application/json'}};
var cache = {};

function domains(){
	/*
    [ { url: 'www.zalando.de',
       mobileUrl: 'm.zalando.de',
       locale: 'de-DE',
       basketUrl: 'https://www.zalando.de/warenkorb',
       currencyCode: 'EUR' },
	*/
	var response = restler.get(url + '/domains', options).on('complete', function(data, response){
		console.log(data);
	});
}

/*
[ { urlKey: 'womens-clothing-tops',
  { urlKey: 'womens-clothing-blouses-tunics',
  { urlKey: 'womens-clothing-dresses',
  { urlKey: 'womens-clothing-skirts',
  { urlKey: 'womens-clothing-jeans',
  { urlKey: 'womens-clothing-trousers-leggings',
  { urlKey: 'womens-clothing-jumpers-cardigans',
  { urlKey: 'womens-clothing-jackets',
  { urlKey: 'womens-clothing-coats',
  { urlKey: 'womens-clothing-sports-clothing',
  { urlKey: 'womens-clothing-swimwear',
  { urlKey: 'womens-clothing-lingerie-nightwear',
  { urlKey: 'womens-clothing-tights-socks',
  */

var top_filter = function(row){
	var arr = ['womens-clothing-tops', 'womens-clothing-blouses-tunics'];
	// 'womens-clothing-jumpers-cardigans'
	return arr.indexOf(row['parentUrlKey']) > -1;
};

var bottom_filter = function(row){
	var arr = ['womens-clothing-skirts', 'womens-clothing-jeans', 'womens-clothing-trousers-leggings'];
	return arr.indexOf(row['parentUrlKey']) > -1;
};

var shoes_filter = function(row){
	return row['parentUrlKey'] === 'womens-shoes';
};

function categories(filter, key, callback){
	if(key in cache){
		console.log(" - Cache hit for " + key);
		callback(cache[key]);	
		return;
	}

	restler.get(url + '/categories/' + domain, options).on('complete', function(data){
		// filter for specific categories
		var filtered = data.data.filter(filter);
		cache[key] = filtered;
		callback(filtered);
	});
	/*
	 { urlKey: 'womens-clothing-a-line-skirts',
    parentUrlKey: 'womens-clothing-skirts',
    depth: 6,
    name: 'A-Line Skirts' },
	*/
}

function fetch_articles(category, callback){
	if(category in cache){
		console.log(" - Cache hit for " + category);
		callback(cache[category]);
		return;
	}

	// i don't know why, but i couldn't get it working with restler :(. But its a hackathon
	var fullurl = url + '/search/' + domain + '/' + category;
	//console.log(fullurl);
	request(fullurl, {headers: {'Accept': 'application/json'}}, function(e,r,b){
		console.log(" - fetched " + category);
		try{
			var json =JSON.parse(b)['searchResults'];
			cache[category] = json['data'];
			callback(json['data']);
		}catch(err){
			console.log(err);
			console.log(b);
			console.log(fullurl);
		}
	});

	/*
  { sku: 'WI321J021-302',
    name: 'Tracksuit bottoms - red',
    urlKey: 'wildfox-tracksuit-bottoms-red-wi321j021-302',
    brandCode: 'WI3',
    price: 95,
    priceOriginal: 95,
    imageUrl: 'http://i1.ztat.net/detail/WI/32/1J/02/13/02/WI321J021-302@1.1.jpg',
    newArticle: false,
    sale: false,
    kids: false,
    oversize: false,
    color: 'red',
    colorFamily: 'Red',
    otherColors: { data: [], count: 0 } },
	*/
}



function init_cache(){
	var cacher = function(data){
		for(var i=0;i<data.length;i++){
			var key = data[i]['urlKey'];
			fetch_articles(data[i]['urlKey'], function(d){});
		}
	};

	categories(top_filter, 'filter-top', cacher);
	categories(bottom_filter, 'filter-bottom', cacher);
	categories(shoes_filter, 'filter-shoes', cacher);

	setTimeout(function(){
		fetch_articles('womens-clothing-tops-tops', function(d){console.log("Banaan")});
		categories(top_filter, 'filter-top', cacher);
	}, 10000);

	// dump after 2 minutes
	setTimeout(write_cache, 120000);
}

function write_cache(){
	/*
		Dear reviewers from Techcrunch, thanks for reading this piece of poetry. For perfomance and demo
		reasons we're dumping the results of the Zalando api in a cache file.
	*/
	console.log("Dump to cache");
	var outfile = "./cached.json";
	fs.writeFile(outfile, JSON.stringify(cache, null, 4), function(err){
		if(err){
			console.log("Ups " + err);
		}
	});
}



/*
var zalando = require('./zalando')
// Get all categories for womens shoes
var callback = function(data){console.log(data);};
// Top
//categories(top_filter, _callback);
// Bottom
zalando.categories(zalando.bottom_filter, callback);
// Shoes
//categories(shoes_filter, _callback);
zalando.fetch_articles('womens-clothing-joggers-sweats', callback);

*/

exports.top_filter = top_filter 
exports.bottom_filter = bottom_filter
exports.shoes_filter = shoes_filter
exports.categories = categories
exports.fetch_articles = fetch_articles
exports.init_cache = init_cache



