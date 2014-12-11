var http = require("http");
var url = require("url");

var server = http.createServer(function(req, res) {

	//Parsing url variables
	var query = url.parse(req.url, true).query;
	console.log(query);
	
	res.writeHead(200, {"Content-Type": "text/plain"});
	res.end("Sponge bob!\n");
});

server.listen(7777);

//Catch all errors (prevent server crashes)
process.on('uncaughtException', function(err) {
	console.log('Caught exception: ' + err);
});
