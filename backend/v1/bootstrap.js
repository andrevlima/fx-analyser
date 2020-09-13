const express = require('express');
const usd = require('./usd/api');
var app = express();

usd.apis(app);

app.listen(8080,function(){
    console.log("Servidor ativo no porto 8080");
});