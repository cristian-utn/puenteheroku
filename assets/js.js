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
accesstoken='APP_USR-3831000572264914-062513-95f7b0725660a47996f27eb1a73d0097-137472805';
// refreshtoken='TG-60cbe39be584b80008f478ec-244140036';
refreshtoken='TG-60d3b82c531f2b000846bc61-137472805';

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
    // itempublicado='MLA926158965'; 
    // itempublicado='MLA926867095'; // crisyea
    // itempublicado='MLA865389265'; // desconocido
    // itempublicado='MLA775832082'; // desconocido
    // itempublicado='MLA926112518'; // desconocido
    itempublicado='MLA926760346'; // desconocido

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
var diccionario={};
var listaparadescargar=[];
var iterador=0;
// var scroll="YXBpY29yZS1pdGVtcy1zZWFyY2g=:ZHMtYXBpY29yZS1pdGVtcy0wNQ==:FGluY2x1ZGVfY29udGV4dF91dWlkDXF1ZXJ5QW5kRmV0Y2gBFGFUN3ROSG9CUUZ4ZGp1YmVUS2NVAAAAAA2Rk1IWUi1RTm1CdTdUaGV3MTF1SUg0elB1QQ==";
// 21562 PUBLICADOS EN MERCADO LIBRE
var scroll="";
function listatotal(){
    var seller_id=137472805; //lo saque de una publicacion tulibroya
    var pais_mercadolibre='MLA';
    fetch('https://api.mercadolibre.com/users/'+seller_id+'/items/search?search_type=scan&limit=100',{
        method:'GET',
        headers:{
            'Authorization': 'Bearer '+accesstoken
        }
    })
    .then( response=>response.json())
    .then( datos => {
        console.log(datos);///////////////////////////
        var len=datos.results;
        for(var i=0;i<len.length;i++){
            diccionario[datos.results[i]]=datos.results[i];
        }
        itemID=datos.scroll_id;
        // publicaciones.innerHTML=itemID;
        for(var i=0;i<217;i++){
            sleep(200);
            listatotal2();
        }
    });
}
var vardeArchivotxt= new XMLHttpRequest();
vardeArchivotxt.open("GET","listapublicados.json",false);
vardeArchivotxt.send(null);
var listacompleta=JSON.parse(vardeArchivotxt.responseText);// lista total de todos los publicados

vardeArchivotxt.open("GET","listaskuwald.json",false);
vardeArchivotxt.send(null);
var listaskuwald=JSON.parse(vardeArchivotxt.responseText);

vardeArchivotxt.open("GET","wald0906.json",false);
vardeArchivotxt.send(null);
var listawald=JSON.parse(vardeArchivotxt.responseText);

vardeArchivotxt.open("GET","wald2306.json",false);
vardeArchivotxt.send(null);
var listawaldayer=JSON.parse(vardeArchivotxt.responseText);
vardeArchivotxt.open("GET","wald2406.json",false);
vardeArchivotxt.send(null);
var listawaldhoy=JSON.parse(vardeArchivotxt.responseText);
function listatotal2(){
    var seller_id=137472805; //lo saque de una publicacion
    var pais_mercadolibre='MLA';
    fetch('https://api.mercadolibre.com/users/'+seller_id+'/items/search?search_type=scan&limit=100&scroll_id='+itemID,{
    // fetch('https://api.mercadolibre.com/questions/search?search_type=scan&item='+itemID,{
        method:'GET',
        headers:{
            'Authorization': 'Bearer '+accesstoken
        }
    })
    .then( response=>response.json())
    .then( datos => {
        // console.log(datos);///////////////////////////
        // itemID=datos.scroll_id;
        var len=datos.results;
        for(var i=0;i<len.length;i++){
            diccionario[datos.results[i]]=datos.results[i];
        }
        itemID=datos.scroll_id;
        console.log(Object.keys(diccionario).length);
    });
}
function mostra(){
    console.log('dic diccionario para llenar');
    console.log(Object.keys(diccionario).length);
    console.log('dic listacompleta');
    console.log(Object.keys(listacompleta).length);
    console.log('dic listawald antes');
    console.log(Object.keys(listawald).length);
    console.log('dic listawald ayer');
    console.log(Object.keys(listawaldayer).length);
    console.log('dic listawald hoy');
    console.log(Object.keys(listawaldhoy).length);
    console.log('list listaparadescargar');
    console.log(listaparadescargar.length);
}
function envia_no_sirve(){
    fetch('/enviolistaml',{
        method:'POST',
        headers: { // cabeceras HTTP
            body: JSON.stringify({
                listademl:diccionario
            }) // convertimos
        }
        // body:data // convertimos
    });
}
function download(){
    // var diccionario2=JSON.parse(diccionario);
    var file=new Blob([JSON.stringify(listaparadescargar)], { type: "application/json"});
    var a= document.createElement('a');
    a.href=URL.createObjectURL(file);
    a.download='datos.json';
    a.click();
}
var contISBN=0;
var contISBNnulo=0;
function extrae1por1(itemml){
    // var itemml=listakey[0];
    // var itemml='MLA926115330';
    fetch('https://api.mercadolibre.com/items/'+itemml,{
        method:'GET',
        headers:{
            'Authorization': 'Bearer '+accesstoken,
            'content-type':'application/x-www-form-urlencoded'
        }
    })
    .then( response=>response.json())
    .then( datos => {
        // console.log(datos);

        var isbn2='';
        var titulo2='';
        var autor2='';
        var editorial2='';
        var tema2='';
        var precio2='';
        var stock2='';
        var fotos2=[];
        var category_id2='';
        var idml2='';
        var sku2='';
        var atributotitulo2='';
        var idioma2='';
        var formato2='';
        var max_edad2='';
        var min_edad2='';
        var condiciones2='';

        titulo2=datos.title;
        // console.log(datos.title);
        // console.log(datos.price);
        precio2=datos.price;
        // console.log(datos.pictures);
        fotos2=datos.pictures;
        // console.log('cantidad de stok');
        // console.log(datos.available_quantity);
        stock2=datos.available_quantity;
        // console.log('categoria ML');
        category_id2=datos.category_id;
        // console.log("cambiar a un ml o id");
        idml2=datos.id;

        var atributosaux=datos.attributes;
        // console.log(atributosaux);
        var boolean=false;
        for(var i=0;i<atributosaux.length;i++){
            // console.log(Object.keys(atributosaux[i]).length);
            // console.log(Object.values(atributosaux[i]).length);
            var key=Object.keys(atributosaux[i]);
            var value=Object.values(atributosaux[i]);

            if(value.includes("SKU")||key.includes('SKU')){
                // console.log('ENCONTRE SKU');
                // console.log(atributosaux[i]); // toda la fila del atributo
                // console.log(atributosaux[i].value_name);// tiene ISBN
                sku2=atributosaux[i].value_name;
                // console.log('ese es su SKU');
            }
            if(value.includes('ISBN')||key.includes('ISBN')){
                if(value.includes('GTIN')||key.includes('GTIN')){
                    // console.log('si esta en iteracion GTIN y ISBN ');
                    if(atributosaux[i].value_name!=null){
                        boolean=true;
                        console.log(atributosaux[i].value_name+'     '+contISBN);// tiene ISBN
                        isbn2=atributosaux[i].value_name;
                    }
                }
                // console.log(atributosaux[i]);
                // console.log(i);
            }
            if(value.includes('BOOK_TITLE')||key.includes('BOOK_TITLE')){
                // console.log('titulo');// 
                // console.log(atributosaux[i].value_name);//
                atributotitulo2=atributosaux[i].value_name;
            }
            if(value.includes('AUTHOR')||key.includes('AUTHOR')){
                // console.log('autor');
                // console.log(atributosaux[i].value_name);// tiene ISBN
                autor2=atributosaux[i].value_name;
            }
            if(value.includes('LANGUAGE')||key.includes('LANGUAGE')){
                // console.log('idioma');
                // console.log(atributosaux[i].value_name);//
                idioma2=atributosaux[i].value_name;
            }
            if(value.includes('PUBLISHER')||key.includes('PUBLISHER')){
                // console.log('editorial');
                // console.log(atributosaux[i].value_name);// 
                editorial2=atributosaux[i].value_name;
            }
            if(value.includes('FORMAT')||key.includes('FORMAT')){
                // console.log('formato papel');
                // console.log(atributosaux[i].value_name);// tiene ISBN
                formato2=atributosaux[i].value_name;
            }
            // console.log('aqui deberia ir GENERO DEL LIBRO');
            if(value.includes('NARRATION_TYPE')||key.includes('NARRATION_TYPE')){
                // console.log('tipo de narracion');
                // console.log(atributosaux[i].value_name);// EN EXCEL TEMA = EN ML TIPO DE NARRACION
                tema2=atributosaux[i].value_name;
            }
            if(value.includes('MAX_RECOMMENDED_AGE')||key.includes('MAX_RECOMMENDED_AGE')){
                // console.log('MAXI');
                // console.log(atributosaux[i].value_name);// tiene ISBN
                max_edad2=atributosaux[i].value_name;
            }
            if(value.includes('MIN_RECOMMENDED_AGE')||key.includes('MIN_RECOMMENDED_AGE')){
                // console.log('MINI');
                // console.log(atributosaux[i].value_name);// tiene ISBN
                min_edad2=atributosaux[i].value_name;
            }
            if(value.includes('ITEM_CONDITION')||key.includes('ITEM_CONDITION')){
                // console.log('estado del producto');
                // console.log(atributosaux[i].value_name);// tiene ISBN
                condiciones2=atributosaux[i].value_name;
            }
        }
        if(boolean){
            contISBN++;
        }
        else{
            contISBNnulo++;
            // console.log('no tiene ISBN');
        }
        listaparadescargar.push(
        {
            isbn:isbn2,
            titulo:titulo2,
            autor:autor2,
            editorial:editorial2,
            tema:tema2,
            precio:precio2,
            stock:stock2,
            fotos:fotos2,
            categoria:category_id2,
            idml:idml2,
            sku:sku2,
            atributotitulo:atributotitulo2,
            idioma:idioma2,
            formato:formato2,
            maxedad:max_edad2,
            minedad:min_edad2,
            condiciones:condiciones2
        });
        // var atributos=datos.attributes={};
    })
    .then(console.log('listo para descargrse'));
}
// de 50
// 10
// 20
// 30
// 40
// 
// https://www.mercadolibre.com.ar/publicaciones/MLA775832082/modificar?callback_url=https%3A%2F%2Fwww.mercadolibre.com.ar%2Fpublicaciones%2Flistado%3Ffilters%3DACTIVE%7CEXCLUSIVE_CHANNEL_NOPROXIMITY%7CEXCLUSIVE_CHANNEL_NOPROXIMITY%26search%3D%26sort%3D%26page%3D1
// https://www.mercadolibre.com.ar/publicaciones/MLA926760346/modificar?callback_url=https%3A%2F%2Fwww.mercadolibre.com.ar%2Fpublicaciones%2Flistado%3Ffilters%3DACTIVE%7CEXCLUSIVE_CHANNEL_NOPROXIMITY%7CEXCLUSIVE_CHANNEL_NOPROXIMITY%26search%3D%26sort%3D%26page%3D1
function revisartodo(){
    var listakey=Object.keys(listacompleta);
    console.log(listakey.length);
    // console.log(listakey[0]);
    for(var i=0;i<listakey.length;i++){
            // console.log('es el:_'+i);
            sleep(8);
            extrae1por1(listakey[i]);
    }
}
var contaglobal=0;
function revisa2dic(){
    var contnull=0;
    var contvacio=0;
    var conte=0;
    // var contskunull=0;
    // var contskuvacio=0;
    // var contsku=0;
    console.log(listacompleta.length); // lista total de todos los publicados
    // console.log(listacompleta[0].idml);
    for(var i=0;i<listacompleta.length;i++){
        // console.log(listacompleta[i].isbn);
        // if(listacompleta[i].isbn==null)contnull++;
        // else if(listacompleta[i].isbn=='')contvacio++;
        // else conte++;

        // console.log(listacompleta[i].isbn);
        // if(listacompleta[i].idml==null)contnull++;
        if(listacompleta[i].sku==''){
            contnull++;
            listaparadescargar.push(listacompleta[i].idml);
        }
        
        // else conte++;
    }
    fetch('https://api.mercadolibre.com/items/'+listaparadescargar[contaglobal],{//    https://developers.mercadolibre.com.ar/es_ar/producto-sincroniza-modifica-publicaciones
        method:'PUT',
        headers:{
            'Authorization': 'Bearer '+accesstoken,
            'accept': 'application/json',
            'content-type':'application/json'
        },
        body:JSON.stringify({
            attributes:[
                {
                    id: "SELLER_SKU",
                    // value_name: "9789507880223" // SOLO ACEPTA NUMEROS PERO EN STRING
                    value_name: "TLY" // SOLO ACEPTA NUMEROS PERO EN STRING
                }                           
            ]
        })
    })
    .then( response=>response.json())
    .then( datos => {
        console.log(datos);
        contaglobal++;
        console.log(contaglobal);
        repite();
    });
    console.log("cont null "+contnull);
    console.log(listaparadescargar.length);
    // console.log(contvacio);
    // console.log(conte);
}
function repite(){
    fetch('https://api.mercadolibre.com/items/'+listaparadescargar[contaglobal],{//    https://developers.mercadolibre.com.ar/es_ar/producto-sincroniza-modifica-publicaciones
    method:'PUT',
    headers:{
        'Authorization': 'Bearer '+accesstoken,
        'accept': 'application/json',
        'content-type':'application/json'
    },
    body:JSON.stringify({
        attributes:[
            {
                id: "SELLER_SKU",
                // value_name: "9789507880223" // SOLO ACEPTA NUMEROS PERO EN STRING
                value_name: "TLY" // SOLO ACEPTA NUMEROS PERO EN STRING
            }                           
        ]
    })
    })
    .then( response=>response.json())
    .then( datos => {
        console.log(datos);
        contaglobal++;
        console.log(contaglobal);
        if(contaglobal<listaparadescargar.length){
            repite();
            sleep(50);
        }
    });
  
  }
function detectamayor(){
    var conte=0;
    var listakeys=Object.keys(listawald);
    console.log(listakeys.length);
    for(var i=0;i<listakeys.length;i++){
        if(listawald[listakeys[i]].stock>3){
            conte++;
        }
        
    }
    console.log(conte);
    // console.log(listawald[listakeys[2]].stock);

}

function muestra3datos(){
    var key1=Object.keys(listawald);
    var key2=Object.keys(listawaldayer);
    var key3=Object.keys(listawaldhoy);
    console.log(Object.keys(listawald).length);
    console.log(Object.keys(listawaldayer).length);
    console.log(Object.keys(listawaldhoy).length);
    console.log(key1[0]);
    console.log(listawald[key1[0]].stock);
    console.log(listawaldayer[key2[0]].titulo);
    console.log(listawaldhoy[key3[0]].pvp);

}
function waldsinflex(){
    var contnull=0;
    console.log(listaskuwald.length); // 15596

    fetch('https://api.mercadolibre.com/sites/MLA/shipping/selfservice/items/'+listaskuwald[contaglobal],{//    https://developers.mercadolibre.com.ar/es_ar/producto-sincroniza-modifica-publicaciones
        method:'DELETE',
        headers:{
            'Authorization': 'Bearer '+accesstoken,
        }
    })
    .then( response=>response.json())
    .then( datos => {
        console.log(datos);
        contaglobal++;
        console.log(contaglobal);
        repitesku();
    });

    console.log(contnull);
}
function repitesku(){
    fetch('https://api.mercadolibre.com/sites/MLA/shipping/selfservice/items/'+listaskuwald[contaglobal],{//    https://developers.mercadolibre.com.ar/es_ar/producto-sincroniza-modifica-publicaciones
    method:'DELETE',
    headers:{
        'Authorization': 'Bearer '+accesstoken,
    }
    })
    .then( response=>response.json())
    .then( datos => {
        console.log(datos);
        contaglobal++;
        console.log(contaglobal);
        if(contaglobal<listaskuwald.length){
            sleep(35);
            repitesku();
            sleep(35);
        }
    });
  
  }