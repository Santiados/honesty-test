// Set up
var express  = require('express');
var app      = express();                                 // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cors = require('cors');
var https = require('https');
var fs = require('fs');

var apiKey = '46202042';
var secret = 'a78fc26ad4ebed2ebc997aa1d79104bb937551ea';
var statidSession = '2_MX40NjIwMjA0Mn5-MTU0MjMxNDExODg4M342ckhkczl2M21zdGROU2JqSDlHNVFrckJ-fg';
var staticToken = 'T1==cGFydG5lcl9pZD00NjIwMjA0MiZzaWc9MmM0OWM3ZmY3NzgxNDBkNTc4YjIzMDU1N2FlZTJlNDJlZmM4ZDcwODpzZXNzaW9uX2lkPTJfTVg0ME5qSXdNakEwTW41LU1UVTBNak14TkRFeE9EZzRNMzQyY2toa2N6bDJNMjF6ZEdST1UySnFTRGxITlZGcmNrSi1mZyZjcmVhdGVfdGltZT0xNTQyNTU1MTY4Jm5vbmNlPTAuNDQ3MzQ1Nzg3ODQxNjY2MjMmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTU0MjY0MTU2OCZpbml0aWFsX2xheW91dF9jbGFzc19saXN0PQ==';

var Opentok = require('opentok');
var opentok = new Opentok(apiKey,secret);
 
// Configuration

 
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());
 
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});
 

// var secureServer = https.createServer({
//     key: fs.readFileSync('./certs/server.key'),
//     cert: fs.readFileSync('./certs/server.crt'),
//     ca: fs.readFileSync('./certs/ca.crt'),
//     requestCert: true,
//     rejectUnauthorized: false
// }, app).listen('8443', function() {
//     console.log("Secure Express server listening on port 8443");
// });


// Routes
 

app.get('/getSessionId', function(req, res) {
    console.log("fetching keys");
    opentok.createSession({mediaMode:"routed"}, function(err, session) {
        if (err) return console.log(err);
        res.json({
            'apiKey': apiKey,
            'sessionId':session.sessionId
        }); // return all reviews in JSON format
      });
});

app.get('/getToken/:id',function(req,res){
    console.log('fetch token');
    console.log(JSON.stringify(req.params.id))
    var token = opentok.generateToken(req.params.id);
    res.json({
        'apiKey':apiKey,
        'sessionId': req.params.id,
        'token': token
    });
});

 
// listen (start app with node server.js) ======================================
app.listen(3000);
console.log("App listening on port 3000");