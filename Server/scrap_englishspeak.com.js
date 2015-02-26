var request = require('request');
var cheerio = require('cheerio');

// Init elastic search
var ElasticSearchClient = require('elasticsearchclient');
var serverOptions = {
    host: 'localhost',
    port: 9200
};

var elasticSearchClient = new ElasticSearchClient(serverOptions);

for(var lessonId = 1; lessonId <= 100; lessonId++)
{
    var url = 'http://www.englishspeak.com/english-lesson.cfm?lessonID=' + lessonId;


    request(url, function(err, resp, body) {

        if (err)
            return;
        $ = cheerio.load(body);
        
        question = ''
        answer = ''

        $('table.blacktext').eq(0).each(function() { 

            $('tr[class^="Data"]').each(function() {


                text = ''
                is_name = true
                $(this).find('span.textSentences').each(function() { 
                    if(!is_name)
                        text = text + $(this).text() + ' '

                    is_name = false
                })

                question = answer
                answer = text
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

            });
        });
    }); 
}
