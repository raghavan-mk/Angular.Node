var http = require("http");
var express = require('express');
var controllers = require("./controllers");
var bodyParser = require("body-parser");
var flash = require("connect-flash");
var cookieparser = require("cookie-parser");
var session = require("express-session");
var json = require("express-json");
var path = require("path");
var app = express();

app.set("view engine", "vash");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieparser());

var options = {
    secret: "MEAN",
    resave: true,
    saveUninitialized: true,
    cookie: {}
};

app.use(session(options));
app.use(flash());
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));

var auth = require("./auth");
auth.init(app);

controllers.init(app);

var server = http.createServer(app);
var port = 3000;
server.listen(port, function () {   
    console.log("Server running at " + port);
});

var updater = require("./updater");
updater.init(server);