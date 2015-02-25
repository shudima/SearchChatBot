var http = require('http');
var elasticsearch = require('elasticsearch');

// Connect to localhost:9200 and use the default settings
var client = new elasticsearch.Client();


var server = http.createServer(function(req, res) {
  console.log('New request: ' + req)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify({ answer_text: "Hello from http" }));
});
console.log('Starts listening on 8080')
server.listen(8080);
