/*var http = require('http');

http.createServer( function(req, res) {
 res.writeHead( 200, {'Content-Type': 'text/html'});
 res.write('<h1>Node.js</h1>');
 res.end('<p>Hello World</p>');
}).listen( 3000);

console.log("HTTP server is listening at port 3000.");*/

var express = require('express');
var app = express();

app.get('/',function (req,res) {
	res.send('Hello World');
});

app.listen(3000,function () {
	console.log('app is listening at port 3000');
});