var http = require("http");
var url = require("url");
var mongo = require("mongodb").MongoClient;
var socketServer = require('socket.io');
var fs = require('fs');

var cache = {
	cachePage : function(path, mimeType) {
		//Put %path%.html in cache.
		fs.readFile("."+path, function (err, data) {
			if (err) {
				throw err;
			}
			cache[path] = data;		//Variable data is a buffer.
			console.log(path + ' is now in cache.');
		});
	}
}

var db; //Used to keep the mongodb connection open

cache.cachePage('/index.html');
cache.cachePage('/admin.html');
//Third party scripts are cached for now, may change in the future.
cache.cachePage('/vendors/jquery/jquery-1.11.1.min.js');
cache.cachePage('/vendors/bootstrap/js/bootstrap.min.js');
cache.cachePage('/vendors/bootstrap/css/bootstrap.min.css');

//req handler (server)
var server = http.createServer(function(req, res) {

	//Parsing url variables
	//var query = url.parse(req.url, true).query;
	//console.log(query);
	var pathname = url.parse(req.url).pathname;
	console.log("Request for " + pathname + " received.");
	route(pathname, req, res);
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

function route(pathname, req, res) {

	if(pathname in cache) {

		res.writeHead(200, {"Content-Type": getMimeType(pathname)});
		res.write(cache[pathname]);
		res.end();
	} else {

		console.log("No request handler found for " + pathname);
		res.writeHead(404, {"Content-Type" : "text/plain"});
		res.write("404 Not found");
		res.end();
	}
}

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
			cltSocket.addListener('adminLog', onAdminLog);	//Admin logging event.
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

function onAdminLog(credentials) {
	//Parse the credentials
	//Validate them.
	//If valid, ???
}

/*******************************************************************************
*													Other Functions Implementation									   	 *
*******************************************************************************/

function getMimeType(pathname) {

	var mimeType;
	var fileExtRegex = /\.[0-9a-z]+$/i;
	var resArray = fileExtRegex.exec(pathname);

	switch(resArray[0]) {
		case ".js": {
			mimeType = 'text/javascript';
			break;
		}
		case ".css": {
			mimeType = 'text/css';
			break;
		}
		case ".html": {
			mimeType = 'text/html';
			break;
		}
	}
	return mimeType;
}
