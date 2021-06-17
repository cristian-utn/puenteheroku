var express = require('express');
var app = express();
var config = require("./config.js").config;
var gets = require('./tests/testget.js');
const https = require('https');
const path=require('path');
var id='8513290730145598';
var localhost='http://localhost:5000';
const url_hosting='https://node-predeterminado-ml.herokuapp.com';
const clave='12';
var variable_recordada='asdf';
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

});
var code_que_reciba_si_lo_tiene_la_url_de_mi_pagina={};
var access_token_que_reciba_por_fetch={};
var refresh_token_que_reciba_por_fetch={};
var todainfo={};
app.get('/envio/:x', function (req, res) {
    console.log(req.url);
    variable_recordada=req.url;
    res.send(req.url);
});

app.get('/recibocod:?', function (req, res) {
    console.log(req.query);
    code_que_reciba_si_lo_tiene_la_url_de_mi_pagina=req.query;
    // res.redirect(localhost);
    res.redirect(url_hosting);
});
app.get('/pidoinfo', function (req, res) {
    res.send(code_que_reciba_si_lo_tiene_la_url_de_mi_pagina);
});
app.post('/enviotoken', function (req, res) {
    var auxtemporal=req.headers.body;
    JSON.parse(auxtemporal);
    access_token_que_reciba_por_fetch=JSON.parse(auxtemporal).access_token;
    refresh_token_que_reciba_por_fetch=JSON.parse(auxtemporal).refresh_token;
});
app.get('/info', function (req, res) {
    res.send({
        code:code_que_reciba_si_lo_tiene_la_url_de_mi_pagina,
        accestoken:access_token_que_reciba_por_fetch,
        refreshtoken:refresh_token_que_reciba_por_fetch
    });
});
app.get('/assets/texto.txt', function (req, res) {
    res.sendFile(path.join(__dirname, 'assets/texto.txt'));
});
app.use(express.static(__dirname + '/assets'));

app.listen(process.env.PORT || 5000, function () {
    console.log('Example app listening on port 5000!');
});
