// const { response } = require("express");

console.log('active');
var id='8513290730145598';
var localhost='http://localhost:5000'
var hosting='https://node-predeterminado-ml.herokuapp.com';
var direccion1='http://auth.mercadolibre.com.ar/authorization?response_type=code&client_id='+id+'&redirect_uri='+hosting;

// secret_key: 'MXZwKgLJCq8EBHCbbiuV0yPP32Q2CoWu',
// redirect_uri: 'https://node-predeterminado-ml.herokuapp.com',
function autentica(){
    console.log('hola');
    window.location=direccion1;
}

// console.log();
// fetch('http://localhost:5000/assets/texto.txt').then(console.log(response));
