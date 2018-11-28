
var express = require('express');
var https = require('https');
var fs = require('fs');

var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cors = require('cors');
var morgan = require('morgan');   


var app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
 });
// const PORT = 80;


const PORT = 443;
https.createServer({
    key: fs.readFileSync('./certs/server.key'),
    cert: fs.readFileSync('./certs/server.crt')
}, app).listen(PORT, function(){
    console.log("My https server listening on port " + PORT + "...");
});

// app.listen(PORT, function(){
//     console.log("My http server listening on port " + PORT + "...");
// });


app.get('/call', function(req, res){
    console.log('hooola')
    res.json({
        message: 'Bien'
    });

})