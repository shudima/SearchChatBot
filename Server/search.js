var indico = require('indico.io').local;

function getSentiment(text, callback)
{
	var http = require('http');

	var data = {
	  data: text
	};

	var userString = JSON.stringify(data);

	var headers = {
	  'Content-Type': 'application/json',
	  'Content-Length': userString.length
	};

	var options = {
	  host: 'apiv1.indico.io',
	  port: 80,
	  path: '/sentiment',
	  method: 'POST',
	  headers: headers
	};

	// Setup the request.  The options parameter is
	// the object we defined above.
	var req = http.request(options, function(res) {
	  res.setEncoding('utf-8');

	  var responseString = '';

	  res.on('data', function(data) {
	    responseString += data;
	  });

	  res.on('end', function() {
	    var resultObject = JSON.parse(responseString);

	    console.log(resultObject.results)
	    callback(Math.floor(resultObject.results * 5 + 5))
	  });
	});

	req.on('error', function(e) {
	  callback(-1)
	});

	req.write(userString);
	req.end();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getQueryForText(text)
{
	question_type = 'regular'

	if(text.indexOf('?') >0) question_type = 'question'

	var query = {
				  "query": {
				    "bool": {
				      "should": [
				        { "match": { "question_text":  text }},
				        { "match": { "question_type": question_type   }}
				      ]
				    }
				  }
				}
	return query
}



module.exports = {
  getAnswerForText: function (elasticSearchClient, text, callback) {

  	query = getQueryForText(text)

  	elasticSearchClient.search('chat', 'questions', query)
		    .on('data', function(data) {

					getSentiment(text, function(res) { 
					
						console.log(res)
						answer_text = '...'
				    	try	
				    	{
					    	question_data = JSON.parse(data)

					    	hits = question_data['hits']['hits']

					    	hit_number = getRandomInt(0, hits.length)
					    	answer_text = question_data['hits']['hits'][hit_number]['_source']['answer_text']
						}
						catch(err)
						{
							console.log(err)
						}

						callback(answer_text, res)
					})
				
		    })
		    .on('error', function(error) {callback(-1)})
			.exec()
   
  },
};

