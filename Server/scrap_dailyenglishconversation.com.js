var request = require('request');
var cheerio = require('cheerio');

function sleep(milliseconds) {
  
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
    else
    {
        console.log('waiting ' + milliseconds - (new Date().getTime() - start))
    }
  }
}

// Init elastic search
var ElasticSearchClient = require('elasticsearchclient');
var serverOptions = {
    host: 'localhost',
    port: 9200
};

var elasticSearchClient = new ElasticSearchClient(serverOptions);

for(var pageId = 1; pageId <= 61; pageId++)
{
    sleep(2000);
    var url = 'http://dailyenglishconversation.com/?paged=' + pageId;


    request(url, function(err, resp, body) {

        if (err)
        {
            console.log(err);
            return;
        }
        $ = cheerio.load(body);
        
        question = ''
        answer = ''

        $('div[id=content]').eq(0).each(function() { 

            $('p').each(function() {


                match = $(this).text().match(".*\\s: (.*)")

  
                if(match != null && match.length > 1)
                    if(match[1].indexOf(';') <= 0)
                    {
                        question = answer
                        answer = match[1]
                        question_type = 'regular'



                        if(question.indexOf("?") > -1) question_type = 'question'

                        document = {
                                        'lang' : 'en',
                                        'question_text' : question,
                                        'question_type' : question_type,
                                        'answer_text' :answer
                                   }

                        elasticSearchClient.index('chat', 'questions', document)
                            .on('data', function(data) {
                                console.log(data)
                            })
                        .exec() 
                        
                console.log(question + ' --> ' + answer) 

                    }
                



            }); 
        });
    }); 
}
