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
var url = "http://disrupt-hackathon.zalando.net";
//var domain = "www.zalando.de";
var domain = "www.zalando.co.uk";
var options = {headers: {'Accept': 'application/json'}};

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
	var categories = ['womens-clothing-tops', 'womens-clothing-blouses-tunics'];
	// 'womens-clothing-jumpers-cardigans'
	return categories.indexOf(row['parentUrlKey']) > -1;
};

var bottom_filter = function(row){
	var categories = ['womens-clothing-skirts', 'womens-clothing-jeans', 'womens-clothing-trousers-leggings'];
	return categories.indexOf(row['parentUrlKey']) > -1;
};

var shoes_filter = function(row){
	return row['parentUrlKey'] === 'womens-shoes';
};

function categories(filter, onresult){
	restler.get(url + '/categories/' + domain, options).on('complete', function(data, response){
		// filter for specific categories
		var filtered = data.data.filter(filter);
		//onresults callback
		onresult(filtered);
	});
}

function shoes(){
	//http://disrupt-hackathon.zalando.net/search/www.zalando.co.uk/shoes
	restler.get(url + '/search/' + domain + '/shoes', options).on('complete', function(data, response){
		console.log(data['searchResults']);
	});

	/*
	<article>
		<brandCode>GU1</brandCode>
		<color>black</color>
		<colorFamily>Black</colorFamily>
		<imageUrl>
		http://i2.ztat.net/detail/GU/11/1C/03/M8/02/GU111C03M-802@1.2.jpg
		</imageUrl>
		<kids>false</kids>
		<name>JARITA - Ankle boots - black</name>
		<newArticle>true</newArticle>
		<otherColors>
		<count>1</count>
		<value>GU111C03M-304</value>
		</otherColors>
		<oversize>false</oversize>
		<price>175.0</price>
		<priceOriginal>175.0</priceOriginal>
		<sale>false</sale>
		<sku>GU111C03M-802</sku>
		<urlKey>guess-jarita-ankle-boots-black-gu111c03m-802</urlKey>
	</article>
	*/
}

/*

*/

//domains();

// Get all categories for womens shoes
var callback = function(data){console.log(data);};
// Top
//categories(top_filter, callback);
// Bottom
categories(bottom_filter, callback);
// Shoes
//categories(shoes_filter, callback);

