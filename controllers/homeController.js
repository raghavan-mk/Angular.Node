/// <reference path="..\\node_modules\\@types\\mssql\\index.d.ts" />
/// <reference path="..\\node_modules\\@types\\connect-flash\\index.d.ts" />

(function (homeController) {
    var express = require("Express");
    var hc = express();
    var data = require("..\\data\\index");
    var flash = require("connect-flash");
    var auth = require("../auth");
    
    homeController.init = function (app) {

        hc = app;

        hc.get("/", function (req, res) {

            data.getNoteCategories(function (err, results) {
                res.render("index", {
                    title: "Express + Vash",
                    error: err,
                    categories: results,
                    newCatErr: req.flash("newCatErr"),
                    user: req.user                    
                });
            });
        });

        hc.get("/api/getUsers", function (req, res) {
            res.json({
                name: "Raghavan",
                id: 26003
            });
        });

        hc.get("/api/sql", function (req, res) {
            var sqlServer = require("mssql");
            var connString =
                "Server=.;Database=OpenchainTests;Uid=ITLINFOSYS\\Raghavan_MK;Pwd=1rc99cs0^6;Trusted_Connection=true;";
            // sqlServer.connect(connString).then(function(){ 
            //     new sqlServer.Request().query('select * from account').then(function(recordset){
            //         return res.json({"result":recordset});
            //     }).catch(function(err){
            //         return res.json({"error":err});
            //     });
            // }).catch(function(err){
            //     console.log(err);
            //     return res.json({"error":err});
            // });

            sqlServer.connect(connString, function (err, result) {
                if (err) {
                    res.send(err);
                }
                new sqlServer.Request().query('select * from account', function (err, result) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    }
                    console.log(result);
                    res.send(result);
                });

            });
        });

        hc.post("/newCategory", function (req, res) {
            var categoryName = req.body.categoryName;
            data.createNewCategory(categoryName, function (err) {
                if (err) {
                    console.log(err);
                    req.flash("newCatErr", err);
                    res.redirect("/");
                } else {
                    res.redirect("/notes/" + categoryName);
                }
            });
        });

    };

})(module.exports);