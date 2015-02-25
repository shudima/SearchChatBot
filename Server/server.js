var http = require('http');
ElasticSearchClient = require('elasticsearchclient');

var serverOptions = {
    host: 'localhost',
    port: 9200
};

var elasticSearchClient = new ElasticSearchClient(serverOptions);

var qryObj = {
    'field' : 'term'
}

elasticSearchClient.search('my_index_name', 'my_type_name', qryObj)
    .on('data', function(data) {
        console.log(JSON.parse(data))
    })
    .on('done', function(){
        //always returns 0 right now
    })
    .on('error', function(error){
        console.log(error)
    })
    .exec()


var server = http.createServer(function(req, res) {
  console.log('New request: ' + req)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify({ answer_text: "Hello from http" }));
});
console.log('Starts listening on 8080')
server.listen(8180);
