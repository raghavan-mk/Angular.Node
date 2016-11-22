//notescontroller.js
(function (notesController) {

    var express = require('express');
    var data = require("..\\data");
    var path = require("path");
    var nc = express();
    var auth = require("../auth");

    notesController.init = function (app) {
        nc = app;

        nc.get("/api/getnotes/:categoryName", function (req, res) {
            var categoryName = req.params.categoryName;
            data.getNotes(categoryName, function (err, notes) {
                if (err) {
                    res.send(400, err);
                } else {
                    res.set("Content_type", "application/json");
                    res.send(notes.notes);
                }
            });
        });

        nc.post("/api/notes/:categoryName", function (req, res) {
            var categoryName = req.params.categoryName;
            var noteToInsert = {
                note: req.body.note,
                color: req.body.color,
                author: "RMK"
            };
            data.addNote(categoryName, noteToInsert, function (err) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.set("Content-Type", "application/json");
                    res.status(201).send(noteToInsert);
                }
            });
        });

        nc.get("/notes/:categoryName",
            auth.ensureApiAuthenticated,
            function (req, res) {
                var categoryName = req.params.categoryName;
                res.render("notes", {
                    title: categoryName,
                    user: req.user
                });
            });
    };

})(module.exports);