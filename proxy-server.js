//
// npm start
// browse to: http://localhost/documents/Historic%20COVID-19%20Dashboard%20Data.xlsx
//

"use strict";

const dataURL = "https://fingertips.phe.org.uk/documents/Historic%20COVID-19%20Dashboard%20Data.xlsx";
const domainURL = "https://fingertips.phe.org.uk";
const documentURL = "/documents/Historic%20COVID-19%20Dashboard%20Data.xlsx";

console.log("============================================================");
console.log(new Date().toISOString() + " - Starting");

var util = require("util");
var logger = require('morgan');
var express = require("express");
var { createProxyMiddleware } = require('http-proxy-middleware');
var compression = require('compression')


/**
 * Returns true if the response should be compressed.
 */
function compressionFilter(req, res) {
    return (/json|text|javascript|font/).test(res.getHeader('Content-Type'));
}

/**
 * Adds headers to a response to enable caching.
 */
function cacheControl() {
    return function(req, res, next) {
        res.setHeader("Cache-Control", "public, max-age=300");
        return next();
    };
}

var port = process.argv[2] || 80;

var app = express();

app.use(cacheControl());
//app.use(compression({filter: compressionFilter}));
app.use(logger());

app.use(function(req, res, next) {
    console.log("req.headers = ", req.headers);
    createProxyMiddleware({ target: domainURL, changeOrigin: true })(req, res, next);
});

app.listen(port);
console.log("Listening on port " + port + "...");
