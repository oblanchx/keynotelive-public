var http = require("http");
var url = require("url");
var mongo = require("mongodb").MongoClient;
var socketServer = require('socket.io');
var fs = require('fs');

//MongoDb server connection
mongo.connect("mongodb://localhost:27017/keynotelive", function(err, db) {
	if(err)
		console.log("Connection fail");
	else
		console.log("Connected correctly to server");

	db.close();
});

var cache = {};

//Put index.html in cache.
fs.readFile('./index.html', function (err, data) {
	if (err) {
		throw err;
	}
	cache['/index.html'] = data;		//Variable data is a buffer.
	console.log('index.html is now in cache.');
});

//Request handler (server)
var server = http.createServer(function(req, res) {

	//Parsing url variables
	var query = url.parse(req.url, true).query;
	console.log(query);

	//Writing response
	res.writeHead(200, {"Content-Type": "text/html"});
	res.write(cache['/index.html']);
	res.end();
});

server.listen(7777);

//Catch all errors (prevent server crashes)
process.on('uncaughtException', function(err) {
	console.log('Caught exception: ' + err);
});

/*******************************************************************************
*															Socket Implementation													   *
*******************************************************************************/

//Socket representation: 	srvSocket:|-----socket-----|:cltSocket
//																	^-- end points --^

var srvSocket = new socketServer(server);
console.log('Server-side socket end point created.');

srvSocket.on('connection', function (cltSocket) {

	console.log('Socket connection established with client.');
	emitInitialData(srvSocket);
	addListeners(cltSocket, srvSocket);
});

//Constants are declared here as they'll be assigned once when server.js is run
//instead of being assigned everytime the addListeners function is called.
const ADMIN_CLT = 0;		//Administrator client.
const NORMAL_CLT = 1;		//Normal client.

//Add listeners for the events coming from the client.
function addListeners(cltSocket, srvSocket) {

	//Client type verification
	var cltType = ADMIN_CLT;

	switch(cltType) {
		case ADMIN_CLT: {

			cltSocket.addListener('adminLog', function(){

			});
			cltSocket.addListener('delete', function(){

			});
			cltSocket.addListener('edit', function(){

			});
			cltSocket.addListener('post', function(){

			});
			break;
		}
		case NORMAL_CLT: {

			cltSocket.addListener('dislike', function(btnId) {

			});
			cltSocket.addListener('like', function(btnId) {

			});
			break;
		}
	}
}

function checkCltType() {

}

function emitInitialData(srvSocket) {

}

/*******************************************************************************
*														Event Handlers Implementation									   	 *
*******************************************************************************/
