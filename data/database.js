////// <reference path="..\\node_modules\\@types\\mongodb\\index.d.ts" />
//database.js

(function (database) {

    var mongodb = require("mongodb");
    var mongourl = "mongodb://127.0.0.1:27017/theBoard";
    var theDb = null;

    database.getDb = function (next) {
        if (!theDb) {
            mongodb.MongoClient.connect(mongourl, function (err, db) {
                if (err) {
                    next(err, db);
                } else {
                    theDb = {
                        db: db,
                        notes: db.collection("notes"),
                        users: db.collection("users")
                    };
                    next(null, theDb);
                }
            });
        } else {
            next(null, theDb);
        }
    };

})(module.exports);