var express = require('express');
var XLSX = require('xlsx');
var app = express();
var config = require("./config.js").config;
var gets = require('./tests/testget.js');
const https = require('https');
const path=require('path');
// var id='8513290730145598';
var id='3831000572264914';
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
var exce;
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
        code:code_que_reciba_si_lo_tiene_la_url_de_mi_pagina.code,
        accestoken:access_token_que_reciba_por_fetch,
        refreshtoken:refresh_token_que_reciba_por_fetch
    });
});
app.get('/assets/texto.txt', function (req, res) {
    res.sendFile(path.join(__dirname, 'assets/texto.txt'));
});
app.get('/excel', function (req, res) {
    res.send(exce);
});
app.use(express.static(__dirname + '/assets'));

app.listen(process.env.PORT || 5000, function () {
    console.log('Example app listening on port 5000!');1
});

// var archi=new FileReader();
// archi.readAsText(__dirname, 'assets/Stocks-09-06-2021.xlsx')
// console.log(archi.result);
const exelajson = () =>{
    const excel=XLSX.readFile('assets/Stocks - Librerías 09-06-2021.xlsx',{CellDates: true});
    var nombrehoja=excel.SheetNames;
    var datos=XLSX.utils.sheet_to_json(excel.Sheets[nombrehoja[0]]);
    console.log(datos);
    exce=datos;
}
exelajson();


// const exelajson = () =>{
//     const excel=XLSX.readFile('assets/Stocks-09-06-2021.xlsx');
//     var nombrehoja=excel.SheetNames;
//     let datos=XLSX.utils.sheet_to_json(excel.Sheets[nombrehoja[0]],{cellDates: true});
//     console.log(datos);
// }
// exelajson();

// en excel
// 35142    con marco arriba
// 32889    sin marco arriba

// en consola de navegador
// aparece 35241 elementos

// en consola de servidor local
// 35142 items mas
