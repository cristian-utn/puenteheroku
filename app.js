var express = require('express');
var app = express();
var config = require("./config.js").config;
var gets = require('./tests/testget.js');

const path=require('path');

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (req, res) {

    res.render('pages/index', {
        client_id: '8513290730145598',
        secret_key: 'MXZwKgLJCq8EBHCbbiuV0yPP32Q2CoWu',
        redirect_uri: 'https://node-predeterminado-ml.herokuapp.com',
        // redirect_uri: 'http://localhost:5000',
        site_id: config.site_id,
        appname: req.subdomains
    });
    console.log('datos para saber de subdomain');
    console.log(req.subdomains);
});
app.get('/envio/:x', function (req, res) {
    res.send("hola llegaste a este link");
});
app.get('/assets/texto.txt', function (req, res) {
    res.sendFile(path.join(__dirname, 'assets/texto.txt'));
});
app.use(express.static(__dirname + '/assets'));

app.listen(process.env.PORT || 5000, function () {
    console.log('Example app listening on port 5000!');
});
