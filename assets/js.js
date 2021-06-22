// const { response } = require("express");
var fecha = new Date();

// const id='750763083';
const id='3831000572264914';
var localhost='http://localhost:5000'
var hosting='https://node-predeterminado-ml.herokuapp.com';
var direccion1='http://auth.mercadolibre.com.ar/authorization?response_type=code&client_id='+id+'&redirect_uri='+hosting;
// const key_secreto='MXZwKgLJCq8EBHCbbiuV0yPP32Q2CoWu';
const key_secreto='77FPBqX5iLYTYe9TZYvrEhzpY9prc4rl';
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
    // window.location=localhost+'/recibocod'+recibi_link;                    // En LOCAL HOST
    window.location=hosting+'/recibocod'+recibi_link;                   // EN HOSTING
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
            document.getElementById('info').innerHTML=Object.values(xdato)[0]+'<br>existe TG dentro';
            document.getElementById('pidekey').disabled = false;
            console.log('borra disabled');
            code=Object.values(xdato)[0];
            // $('pidekey').prop('disabled', false);
        }
        else document.getElementById('info').innerHTML='no se que paso';
        // document.getElementById('info').innerHTML=Object.values(xdato)+'<p>'+xdato.code+'</p>';
    });
}
pidodatosdeservidor(); // pido code
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
    });
    // .finally(console.log('enviado'));
    // .then( response=>response.json())
}
function pedirkeyorefresh(){
    console.log('el code que usare para pedir key es:');
    console.log('el code actual');
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
        refreshtoken=datos.refresh_token;
        
        console.log('el actual access_token');
        console.log(datos.access_token);
        console.log('el ACTUAL refresh_token');
        console.log(datos.refresh_token);

        document.getElementById('pidekeyrefresh').disabled = false;
        enviar2datos(datos.access_token,datos.refresh_token);
    });
}

function vertodo(){
    fetch('/info')
    .then(response=>response.json())
    .then(data=>{
        for(var i=0;i<Object.keys(data).length;i++){
            document.getElementById('infotodo').innerHTML='';
            document.getElementById('infotodo').innerHTML+='<p>'+Object.keys(data)[i]+'='+Object.values(data)[i]+'</p>';
        }
    });
}
//
function pedirRefreshToken(){
    console.log('BOTON pide Key refresh');
    console.log('el code actual');
    console.log(code);
    fetch('https://api.mercadolibre.com/oauth/token',{
        method:'POST',
        headers:{
            'accept': 'application/json',
            'content-type':'application/x-www-form-urlencoded'
        },
        // https://api.mercadolibre.com/oauth/token:'https://api.mercadolibre.com/oauth/token',
        body:JSON.stringify({
            grant_type: 'refresh_token',
            client_id: id,
            client_secret: key_secreto,
            refresh_token: refreshtoken,
        })
    })
    .then( response=>response.json())
    .then( datos => {
        console.log(datos);
        accesstoken=datos.access_token;
        refreshtoken=datos.refresh_token;
        console.log('el actual access_token');
        console.log(datos.access_token);
        document.getElementById('infonuevotoken').innerHTML='<p>'+datos.access_token+'</p>';
        console.log('el ACTUAL refresh_token');
        console.log(datos.refresh_token);
        document.getElementById('infonuevotoken').innerHTML+='<p>'+datos.refresh_token+'</p>';
        document.getElementById('pidekeyrefresh').disabled = false;
        enviar2datos(datos.access_token,datos.refresh_token);
    });
    console.log('boton pide Key refresh');
    fecha = new Date();
    fecha.setHours(fecha.getHours()+6);
    alert('su token expira a las '+fecha.getHours()+' y '+fecha.getMinutes()+'pero se renueva automaticamente');
    setTimeout(function(){
        alert('tengo ganas de actualizar el token ');
    }, 5000);
    setTimeout(function(){
        pedirRefreshToken();
    }, 21000000);
}
//////////////////////////
// const id='8513290730145598';
// const key_secreto='MXZwKgLJCq8EBHCbbiuV0yPP32Q2CoWu';

// accesstoken='APP_USR-8513290730145598-061818-e0e082a1235a079fb5c4c8303c6773ae-244140036';
accesstoken='APP_USR-3831000572264914-062217-2d0c2ac696d1ed4b81eac84711b7ec1b-137472805';
// refreshtoken='TG-60cbe39be584b80008f478ec-244140036';
refreshtoken='TG-60d218d4122d33000728971b-137472805';

// itempublicado='MLA860038719';
// "MLA412445"      categoria   Libros, Revistas y ComicsLibrosAutoayudaSuperación personal

// var itempublicado='MLA750852053'; //libro ajeno
var itempublicado='MLA926148119'; //item auxiliar
function publicar1(){
    fetch('https://api.mercadolibre.com/items',{
        method:'POST',
        headers:{
            'Authorization': 'Bearer '+accesstoken
        },
        // https://api.mercadolibre.com/oauth/token:'https://api.mercadolibre.com/oauth/token',
        body:JSON.stringify(
            {
                title:"ejercicio libro 4 Item de test - No Ofertar",
                category_id:"MLA412445",
                price:350,
                currency_id:"ARS",
                available_quantity:10,
                buying_mode:"buy_it_now",
                condition:"new",
                listing_type_id:"gold_special",
                description:{
                    plain_text:"Descripción con Texto Plano "
                },
                video_id:"https://www.youtube.com/watch?v=uG4Sixk2srw&list=PL2Z95CSZ1N4HM7gzW8gK1Jt3lGWQO0k_G",
                sale_terms:[
                   {
                    id:"WARRANTY_TYPE",
                    value_name:"Garantía del vendedor"
                   },
                   {
                    id:"WARRANTY_TIME",
                    value_name:"90 días"
                   }
                ],
                pictures:[
                   {
                    source:"http://mla-s2-p.mlstatic.com/968521-MLA20805195516_072016-O.jpg"
                   }
                ],
                attributes:[
                    {
                        id: "AUTHOR",
                        value_name: "String"
                        },
                        {
                        id: "BOOK_TITLE",
                        value_name: "String"
                        },
                        {
                        id: "FORMAT",
                        value_name: "Papelmojado"
                        },
                        {
                        id: "ISBN",
                        // value_name: "9789507880223" // SOLO ACEPTA NUMEROS PERO EN STRING
                        value_name: "9789875665613" // SOLO ACEPTA NUMEROS PERO EN STRING
                        },
                        {
                        id: "NARRATION_TYPE",
                        value_name: "String"
                        }                           
                ]
            }
        )
    })
    .then( response=>response.json())
    .then( datos => {
        console.log(datos);
    });
}
function actualizar(){
fetch('https://api.mercadolibre.com/items/'+itempublicado,{//    https://developers.mercadolibre.com.ar/es_ar/producto-sincroniza-modifica-publicaciones
        method:'PUT',
        headers:{
            'Authorization': 'Bearer '+accesstoken,
            'accept': 'application/json',
            'content-type':'application/json'
        },
        body:JSON.stringify({
            price: 900,
            available_quantity:3,
            sale_terms:[
                {
                 id:"WARRANTY_TYPE",
                 value_name:"Garantía del vendedor"
                },
                {
                 id:"WARRANTY_TIME",
                 value_name:"90 días"
                },
                {
                    id:"MANUFACTURING_TIME",
                    value_name:"3 días"
                }
             ]
            // MANUFACTURING_TIME:'3'
            // hierarchy:3
        })
    })
    .then( response=>response.json())
    .then( datos => {
        console.log(datos);
    });
}
function buscaycambia(){
    var seller_id=244140036 //lo saque de una publicacion
    // 9789875665613
    var pais_mercadolibre='MLA';
    var ISBM=document.getElementById('campoisbm').value;
    var nuevostock=document.getElementById('campostock').value;
    var nuevoprecio=document.getElementById('campoprecio').value;
    // fetch('https://api.mercadolibre.com/sites/'+pais_mercadolibre+'/search?site_id=MLA'+'&q=9789875665613',{
    var largo;
    var encontrado;
    var listaids=[];//ahora comparar cuando los tenga
    fetch('https://api.mercadolibre.com/sites/'+pais_mercadolibre+'/search?seller_id='+seller_id,{
        method:'GET',
        headers:{
            'Authorization': 'Bearer '+accesstoken
        }
    })
    .then( response=>response.json())
    .then( datos => {
        // console.log(datos.results);///////////////////////////
        largo=datos.results;
        // var lista=Object.keys(datos.result)
        document.getElementById('titulopublicaciones').innerHTML='Publicaciones: '+largo.length;
        document.getElementById('publicaciones').innerHTML='';
        for(var i=0;i<largo.length;i++){
            // console.log('reviso item: '+i);
            listaids.push(largo[i].id);
            document.getElementById('publicaciones').innerHTML+=`
            <div class="publicacion">
            <div class="detail">
            <p>titulo: <strong>${datos.results[i].id}</strong></p>
            <p>titulo: <strong>${datos.results[i].title}</strong></p>
            <p>precio: <strong>${datos.results[i].price}</strong></p>
            <p>stock: <strong>${datos.results[i].available_quantity}</strong></p>
            <p>foto: <strong>${datos.results[i].thumbnail}</strong></p>
            </div>
            <img src="${datos.results[i].thumbnail}" alt="no se encontro o hay mas de 1">
            </div>
            `;
        }
    })
    .then(dato=>{
        console.log(listaids.length);
        for(var i=0;i<listaids.length;i++){
            fetch('https://api.mercadolibre.com/items/'+listaids[i],{
                method:'GET',
                headers:{
                    'Authorization': 'Bearer '+accesstoken,
                    'content-type':'application/x-www-form-urlencoded'
                }
            })
            .then( response=>response.json())
            .then( datos => {
                var propiedad=datos.attributes;
                // console.log(propiedad);
                for(var j=0;j<propiedad.length;j++){
                    // console.log(propiedad[j]);
                    if(propiedad[j].value_name==ISBM){
                        // console.log('posicion i');
                        // console.log(i);
                        // console.log('posicion j');
                        // console.log(j);
                        // console.log(datos.id);
                            fetch('https://api.mercadolibre.com/items/'+datos.id,{//    https://developers.mercadolibre.com.ar/es_ar/producto-sincroniza-modifica-publicaciones
                                    method:'PUT',
                                    headers:{
                                        'Authorization': 'Bearer '+accesstoken,
                                        'accept': 'application/json',
                                        'content-type':'application/json'
                                    },
                                    body:JSON.stringify({
                                        price: nuevoprecio,
                                        available_quantity:nuevostock
                                    })
                                })
                                .then( response=>response.json())
                                .then( datos => {
                                    console.log(datos);
                                });
                    }
                }
            });
        }
    })
        //     console.log(listatributos[i]);
        //     for(var j=0;j<listatributos[i].length;j++){
        //         console.log(listatributos[i][j]);
        //     }
        //     // }
                // if('id' in larg[j]){
                //     if('GTIN' == larg[j].id)
                //     if('value_name' in larg[j] && larg[j].value_name == ISBM)
                //     encontrado=largo[i].id;
                //     permito=true;
                //     // break;
                // }
                // else if('ISBM' in larg[j])
                // if('value_name' in larg[j] && larg[j].value_name == ISBM){
                //     encontrado=largo[i].id;
                //     permito=true;
                //     // break;
}
function listar(){ //////////////////////////////////////////////////"    9789507880223    "
    // https://developers.mercadolibre.com.ar/es_ar/items-y-busquedas
    // https://api.mercadolibre.com//items?ids=$ITEM_ID1,$ITEM_ID2&attributes=$ATTRIBUTE1,$ATTRIBUTE2,$ATTRIBUTE3
    // var seller_id=244140036; //lo saque de una publicacion
    var seller_id=137472805; //lo saque de una publicacion
    var pais_mercadolibre='MLA';
    fetch('https://api.mercadolibre.com/sites/'+pais_mercadolibre+'/search?seller_id='+seller_id,{
        method:'GET',
        headers:{
            'Authorization': 'Bearer '+accesstoken
        }
    })
    .then( response=>response.json())
    .then( datos => {
        console.log(datos);///////////////////////////
        // var lista=Object.keys(datos.result)
        document.getElementById('titulopublicaciones').innerHTML='Publicaciones: '+datos.results.length;
        document.getElementById('publicaciones').innerHTML='';
        for(var i=0;i<datos.results.length;i++){
            document.getElementById('publicaciones').innerHTML+=`
            <div class="publicacion">
            <div class="detail">
            <p>titulo: <strong>${datos.results[i].title}</strong></p>
            <p>precio: <strong>${datos.results[i].price}</strong></p>
            <p>stock: <strong>${datos.results[i].available_quantity}</strong></p>
            <p>foto: <strong>${datos.results[i].thumbnail}</strong></p>
            </div>
            <img src="${datos.results[i].thumbnail}" alt="no se encontro o hay mas de 1">
            </div>
            `;
        }
    });
}

function mostrar_1_producto(){//segun ML
    itempublicado='MLA926158965';
    fetch('https://api.mercadolibre.com/items/'+itempublicado,{
        method:'GET',
        headers:{
            'Authorization': 'Bearer '+accesstoken,
            'content-type':'application/x-www-form-urlencoded'
        }
    })
    .then( response=>response.json())
    .then( datos => {
        console.log(datos);
    });
}
//hierarchy
function activar_stock_espera(){//segun ML
    fetch('https://api.mercadolibre.com/categories/'+"MLA412445"+'/sale_terms',{
        method:'GET',
        headers:{
            'Authorization': 'Bearer '+accesstoken,
        }
    })
    .then( response=>response.json())
    .then( datos => {
        console.log(datos);
    });
//    https://developers.mercadolibre.com.ar/es_ar/producto-sincroniza-modifica-publicaciones
}

////////////////////// apartado PARA INDAGAR mas sobre busquedas
    // https://api.mercadolibre.com/sites/MLA/search?seller_id=244140036&ISBM=9789875665613
    // fetch('https://api.mercadolibre.com/sites/'+pais_mercadolibre+'/search?seller_id='+seller_id+'&ISBM='+ISBM,{
        // https://api.mercadolibre.com/products/search?status=active&site_id=MLA&q=Samsung%20Galaxy%20S8
    // fetch('https://api.mercadolibre.com/products/search?status=active&site_id=MLA+&q='+ISBM,{
        // fetch('https://api.mercadolibre.com/sites/'+pais_mercadolibre+'/search?site_id='+'MLA'+'&product_identifier='+'9789875665613'+'&limit=1',{
////////////////////// apartado PARA INDAGAR mas sobre busquedas










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
const modal= document.querySelector('.logo');
function activa(){
    var ancho = window.innerWidth;
    if (modal.classList.contains('movelogo')){
        modal.classList.remove('movelogo');
        modal.style.left='0px';
    }
    else{
        modal.classList.add('movelogo');
        ancho=ancho-208;
        modal.style.left=ancho+'px';
    }
    setTimeout(function(){
        activa();
    }, 3000);
}
activa();


function sleep(milliseconds) {
var start = new Date().getTime();
for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
    break;
    }
}
}

function demo() {
    console.log('Taking a break...');
    sleep(200);
    console.log('Two second later');
}

var datoexcel=[];
function pedirexcel(){
    document.getElementById('publicaciones').innerHTML='';
    fetch('excel')
    .then( response=>response.json())
    .then( datos => {
        console.log(datos);
        modificar(datos);
        console.log(datoexcel.length);
        for(var i=0;i<100;i++){
            document.getElementById('publicaciones').innerHTML+=`
            <div class="publicacion">
            <div class="detail">
            <p>ISBM: <strong>${datoexcel[i].ISBM}</strong></p>
            <p>Titulo: <strong>${datoexcel[i].Titulo}</strong></p>
            <p>Autor: <strong>${datoexcel[i].Autor}</strong></p>
            <p>Editorial: <strong>${datoexcel[i].Editorial}</strong></p>
            <p>Tema: <strong>${datoexcel[i].Tema}</strong></p>
            <p>Stock: <strong>${datoexcel[i].Stock}</strong></p>
            <p>PVP: <strong>${datoexcel[i].PVP}</strong></p>
            <p>TituloP: <strong>${datoexcel[i].TituloP}</strong></p>
            <p>Portada: <strong>${datoexcel[i].Portada}</strong></p>
            </div>
            <img src="${datoexcel[i].Portada}" alt="no se encontro o hay mas de 1">
            </div>
            `;
            // demo();
            
            // console.log(datoexcel[i].ISBM);
        }
        return datos;
    }).then(a=>{
        // modificar(a);
    })
}
function modificar(entra){
    datoexcel=entra;
}
function variable(datoexcel){
    console.log('ten dato');
    console.log(datoexcel);
}
var itemID;
var scroll="YXBpY29yZS1pdGVtcy1zZWFyY2g=:ZHMtYXBpY29yZS1pdGVtcy0wNQ==:FGluY2x1ZGVfY29udGV4dF91dWlkDXF1ZXJ5QW5kRmV0Y2gBFGFUN3ROSG9CUUZ4ZGp1YmVUS2NVAAAAAA2Rk1IWUi1RTm1CdTdUaGV3MTF1SUg0elB1QQ==";
// 21562 PUBLICADOS EN MERCADO LIBRE
var scroll="";
function listatotal(){
    var seller_id=137472805; //lo saque de una publicacion
    var pais_mercadolibre='MLA';
    fetch('https://api.mercadolibre.com/users/'+seller_id+'/items/search?search_type=scan&limit=1000',{
        method:'GET',
        headers:{
            'Authorization': 'Bearer '+accesstoken
        }
    })
    .then( response=>response.json())
    .then( datos => {
        console.log(datos);///////////////////////////
        itemID=datos.scroll_id;
        // publicaciones.innerHTML=itemID;
    });
}

function listatotal2(){
    var seller_id=137472805; //lo saque de una publicacion
    var pais_mercadolibre='MLA';
    // fetch('https://api.mercadolibre.com/users/'+seller_id+'/items/search?search_type=scan&limit=1000',{
    fetch('https://api.mercadolibre.com/questions/search?search_type=scan&item='+itemID,{
        method:'GET',
        headers:{
            'Authorization': 'Bearer '+accesstoken
        }
    })
    .then( response=>response.json())
    .then( datos => {
        console.log(datos);///////////////////////////
    });
}