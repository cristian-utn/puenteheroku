// const { response } = require("express");
console.log('active');
var id='8513290730145598';
var localhost='http://localhost:5000'
var hosting='https://node-predeterminado-ml.herokuapp.com';
var direccion1='http://auth.mercadolibre.com.ar/authorization?response_type=code&client_id='+id+'&redirect_uri='+hosting;
const key_secreto='MXZwKgLJCq8EBHCbbiuV0yPP32Q2CoWu';
var code='';
var accesstoken='';
var refreshtoken='';
// PASO 2
function autentica(){
    window.location=direccion1;
}
// PASO 2
// encontrar CODE 1
var recibi_link=window.location.search;
if(recibi_link.indexOf('code')!=-1){
    console.log('Si encontre');
    console.log(recibi_link.slice(recibi_link.indexOf('code')+5));
    var code_sacado=recibi_link.slice(recibi_link.indexOf('code')+5);
    // window.location=localhost+'/recibo'+recibi_link;                    // En LOCAL HOST
    window.location=hosting+'/recibo'+recibi_link;                   // EN HOSTING
    // curl -X POST -H 'accept: application/json' -H 'content-type: application/x-www-form-urlencoded' 'https://api.mercadolibre.com/oauth/token' -d 'grant_type=authorization_code' -d 'client_id=$APP_ID' -d 'client_secret=$SECRET_KEY' -d 'code=$SERVER_GENERATED_AUTHORIZATION_CODE' -d 'redirect_uri=$REDIRECT_URI'

    // console.log(window.location.search.split('code=')[window.location.search.split('code=').length-1]);
}//Este code, será utilizado cuando se necesite generar un access token, que permitirá el acceso a nuestras API.
else{ // importante agregar status cuando ya sea APLICACION PRODUCTIVA PRODUCCION
    console.log('No encontre');
}
function pidodatosdeservidor(){
    fetch('/pidoinfo')
    // .then(dato=>JSON.stringify(dato))
    .then(response=>response.json())
    .then(xdato=>{
        console.log(xdato);
        // console.log(Object.values(xdato));
        // console.log(Object.values(xdato)[0]);
        if(Object.values(xdato)[0]==null){
            document.getElementById('info').innerHTML='no hay datos';
        }
        else if(Object.values(xdato)[0].indexOf('TG')!=-1){ // PROVISORIO REEMPLAZAR POR BUSCADOR DE KEYS WHIT GET o HASH DENTRO DE UN JSON QUE ABARQUE TODOS LOS DATOS
            document.getElementById('info').innerHTML=Object.values(xdato)+'<p>'+'existe TG dentro'+'</p>';
            document.getElementById('pidekey').disabled = false;
            console.log('borra disabled');
            code=Object.values(xdato)[0];
            // $('pidekey').prop('disabled', false);
        }
        else document.getElementById('info').innerHTML='no se que paso';
        // document.getElementById('info').innerHTML=Object.values(xdato)+'<p>'+xdato.code+'</p>';
    });
}
pidodatosdeservidor();
function pedirkeyorefresh(){
    console.log('el code que usare para pedir key es');
    console.log(code);
    fetch('https://api.mercadolibre.com/oauth/token',{
        method:'POST',
        headers:{
            'accept': 'application/json',
            'content-type':'application/x-www-form-urlencoded'
        },
        // https://api.mercadolibre.com/oauth/token:'https://api.mercadolibre.com/oauth/token',
        body:JSON.stringify({
            grant_type: 'authorization_code',
            client_id: id,
            client_secret: key_secreto,
            code: code,
            redirect_uri: hosting
        })
    })
    .then( response=>response.json())
    .then( datos => {
        console.log(datos);
        accesstoken=datos.access_token;
        refreshtoken=refresh_token;
        document.getElementById('pidekeyrefresh').disabled = false;
        enviar2datos(accesstoken,refreshtoken);
    })
}
function enviar2datos(acces,refres){
    // console.log(data);
    fetch('/enviotoken',{
        method:'POST',
        headers: { // cabeceras HTTP
            body: JSON.stringify({
                access_token:acces,
                refresh_token:refres
            }) // convertimos
        }
        // body:data // convertimos
    })
    .then(function(response) {
        if(response.ok) {
            return response.text()
        } else {
            throw "Error en la llamada Ajax";
        }
     });
    // .finally(console.log('enviado'));
    // .then( response=>response.json())
}
function vertodo(){
    fetch('/info').then(response=>response.json()).then(data=>{
        for(var i=0;i>Object.keys(data).length;i++){
            document.getElementById('todoinfo').innerText='<p>'+Object.keys(data)[i]+'='+Object.values(data)+'</p>';
        }
    });
}















var formu=document.getElementById('fo');
formu.addEventListener('submit',function(e){
    // e.preventDefault();
    var dat=new FormData(formu);
    console.log('dato te');
    console.log(dat.get('te'));
    console.log(window.location.href);
    console.log(window.location.protocol);
    console.log('dato fin');
    var ruta_reemplazada=window.location.href;
    ruta_reemplazada=ruta_reemplazada.replace('?','');
    fetch(ruta_reemplazada,{
        method:'POST',
        body: dat
    })
    .then( response=>response.json())
    .then( datos => {
        console.log(datos);
    })
});
// fetch('http://localhost:5000/assets/texto.txt').then(console.log(response));
