// const { response } = require("express");

const { json } = require("express");

console.log('active');
var id='8513290730145598';
var localhost='http://localhost:5000'
var hosting='https://node-predeterminado-ml.herokuapp.com';
var direccion1='http://auth.mercadolibre.com.ar/authorization?response_type=code&client_id='+id+'&redirect_uri='+hosting;
const key_secreto='MXZwKgLJCq8EBHCbbiuV0yPP32Q2CoWu';
// PASO 2
function autentica(){
    console.log('hola');
    window.location=direccion1;
}
// PASO 2
// encontrar CODE 1
var recibi_link=window.location.search;
if(recibi_link.indexOf('code')!=-1){
    console.log('Si encontre');
    console.log(recibi_link.slice(recibi_link.indexOf('code')+5));
    var code_sacado=recibi_link.slice(recibi_link.indexOf('code')+5);
    fetch('',{
        method:'POST',
        headers:{
            'accept': 'application/json'
            'content-type':'application/x-www-form-urlencoded',
        },
        // https://api.mercadolibre.com/oauth/token:'https://api.mercadolibre.com/oauth/token',
        body:JSON.stringify({
            nombre:'cris',
            grant_type:authorization_code,
            client_id:id,
            client_secret: key_secreto,
            code: code_sacado,
            redirect_url: hosting
        })
    }).then(console.log(response=>{
        return response.json()
    }));
    // curl -X POST -H 'accept: application/json' -H 'content-type: application/x-www-form-urlencoded' 'https://api.mercadolibre.com/oauth/token' -d 'grant_type=authorization_code' -d 'client_id=$APP_ID' -d 'client_secret=$SECRET_KEY' -d 'code=$SERVER_GENERATED_AUTHORIZATION_CODE' -d 'redirect_uri=$REDIRECT_URI'

    // console.log(window.location.search.split('code=')[window.location.search.split('code=').length-1]);
}//Este code, será utilizado cuando se necesite generar un access token, que permitirá el acceso a nuestras API.
else{ // importante agregar status cuando ya sea APLICACION PRODUCTIVA PRODUCCION
    console.log('No encontre');
}
console.log();
// fetch('http://localhost:5000/assets/texto.txt').then(console.log(response));
