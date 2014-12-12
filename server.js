var http = require("http");
var url = require("url");
var mongo = require("mongodb").MongoClient;
var socketServer = require('socket.io');
var fs = require('fs');


var db; //Used to keep the mongodb connection open
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

//MongoDb server connection
mongo.connect("mongodb://localhost:27017/keynotelive", function(err, db) {
	if(err) //Kill the server if the mongodb connection fail
	{
		console.log("MongoDb: Connection fail.");
		process.exit();
	}
	else //Launch the server if the mongodb connection succeed
	{
		console.log("MongoDb: Connected correctly to server.");
		server.listen(7777);
	}

	var posts = db.collection("posts");
});


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

			cltSocket.addListener('adminLog', function() {

			});
			cltSocket.addListener('delete', function() {

			});
			cltSocket.addListener('edit', function(id, data) {

			});
			cltSocket.addListener('post', function(data) {
				//Will store the content of the post in the database and broadcast it to
				//the clients.
				srvSocket.emit('post', data);
			});
			break;
		}
		case NORMAL_CLT: {

			cltSocket.addListener('dislike', onDislike);
			cltSocket.addListener('like', onLike);
			cltSocket.addListener('ready', onReady);
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

function onLike(id) {
	//Will call a function that will increment the like counter of the
	//like element identified by the 'id' parameter.
}

function onDislike(id) {
	//Will call a function that will increment the dislike counter of the
	//dislike element identified by the 'id' parameter.
}

function onReady(latestKeynotePoint) {
	//Fetch the keynote data from the point pointed by 'latestKeynotePoint' (the
	//latest keynote point in the client's cache) to the latest keynote in the
	//database.

	//Send the data to the client that emitted the 'ready' event.
	
}
