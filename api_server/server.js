var https = require('https')
    ,fs = require("fs");

var express = require('express');
var app = express();

//----HTTPS
var options = {
    key: fs.readFileSync('./ssl/privkey.pem'),
    cert: fs.readFileSync('./ssl/fullchain.pem')
};

https.createServer(options, app).listen(443, function () {
    console.log('Https server listening on port ' + 443);
});
//----HTTP
var port = process.env.PORT || 80;
app.listen(port);
//----END

var router = express.Router();

router.use(function(req, res, next){
    console.log('something happening...');
    next();
});

app.use('/p-proj-1702',router);

router.route('/test_api')
    .get(function (req, res){
        res.json({info:"GET form Mamoru"});});

