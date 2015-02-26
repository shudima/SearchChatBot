var http = require('http');
var url = require('url');
var search = require('./search')

var port_number = 8080

// Init elastic search
var ElasticSearchClient = require('elasticsearchclient');
var serverOptions = {
    host: 'localhost',
    port: 9200
};


// create server
var server = http.createServer(function(req, res) {

  	var url_parts = url.parse(req.url, true);
  	var query = url_parts.query;
  	var elasticSearchClient = new ElasticSearchClient(serverOptions);
	console.log('New request: ' + query.text)
   	
	if (query.text != undefined)
	{

	   	// Search for answer if for given question
		search.getAnswerForText(elasticSearchClient, query.text, function(answer_text){

			res.setHeader('Access-Control-Allow-Origin', '*');
			res.end(JSON.stringify({ 'answer_text': answer_text }));
		})
	}
	else
	{
		res.end();
	}

});

// start server
server.listen(port_number);
console.log('Listening on ' + port_number)

