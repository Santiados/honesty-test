var https = require('https'),
    fs = require('fs'), 
    express = require('express'), 
    app = express();
    
var secureServer = https.createServer({
    key: fs.readFileSync('./certs/server.key'),
    cert: fs.readFileSync('./certs/server.crt'),
    ca: fs.readFileSync('./certs/ca.crt'),
    requestCert: true,
    rejectUnauthorized: false
}, app).listen('8443', function() {
    console.log("Secure Express server listening on port 8443");
});

app.get('/loop',function(req,res){
    console.log('loop')
    res.end('looopp');
});