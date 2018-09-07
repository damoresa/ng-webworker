const finalhandler = require('finalhandler');
const http = require('http');
const serveStatic = require('serve-static');

// Serve up the dist
const serve = serveStatic('dist/ng-webworker', {'index': ['index.html']});

// Create server
const server = http.createServer(function onRequest (req, res) {
  serve(req, res, finalhandler(req, res));
});

// Listen
server.listen(4200);
