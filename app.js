var express = require('express');
var app = express();
var config = require("./config.js").config;
var gets = require('./tests/testget.js');


// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (req, res) {

    res.render('pages/index', {
        client_id: config.client_id,
        secret_key: config.secret_key,
        redirect_uri: config.redirect_uri,
        site_id: config.site_id,
        appname: req.subdomains
    });
});

app.use(express.static(__dirname + '/assets'));

app.listen(process.env.PORT || 5000, function () {
    console.log('Example app listening on port 5000!');
});
