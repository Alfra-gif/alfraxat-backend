const express = require("express");
const bodyParser = require("body-parser");
//const fs = require('fs');
//const http = require('http');
//const https = require('https');

var app = express();

//carregar rutes
project_routes = require("./routes/routes")

//your express configuration here

//middlewares
//codifiquem a json tot el que ens arriba
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//cors
var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control, Authorization");
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);

//rutes
app.use("/api",project_routes);

//exportar
module.exports = app;

