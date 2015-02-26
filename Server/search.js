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

		    	answer_text = '...'
		    	try	
		    	{
			    	question_data = JSON.parse(data)
			    	console.log(question_data)

			    	hits = question_data['hits']['hits']

			    	hit_number = getRandomInt(0, hits.length / 2)
			    	answer_text = question_data['hits']['hits'][hit_number]['_source']['answer_text']
				}
				catch(err)
				{
					console.log(err)
				}

				callback(answer_text)
		    })
		    .on('error', function(error) {callback(-1)})
			.exec()
   
  },
};

