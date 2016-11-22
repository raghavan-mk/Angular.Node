////// <reference path="./seedData.js" />
/// <reference path="./database.js" />
////// <reference path=".\\node_modules\\@types\\mongodb\index.d.ts" />

(function (data) {

    var seedData = require("./seedData");
    var database = require("./database");

    data.getNoteCategories = function (next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err, null);
            } else {
                db.notes.find().toArray(function (err, results) {
                    if (err) {
                        next(err, null);
                    } else {
                        next(null, results);
                    }
                });
            }
        });
    };

    data.getNotes = function (categoryName, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.notes.findOne({
                    name: categoryName
                }, next);
            }
        });
    };

    data.addNote = function (categoryName, noteToInsert, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.notes.update({
                    name: categoryName
                }, {
                    $push: {
                        notes: noteToInsert
                    }
                }, next);
            }
        });
    };


    data.createNewCategory = function (categoryName, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.notes.find({
                    name: categoryName
                }).count(function (err, count) {
                    if (err) {
                        next(err);
                    } else {
                        if (count != 0) {
                            next("Category:" + categoryName + " already exists");
                        } else {
                            var cat = {
                                name: categoryName,
                                notes: []
                            };
                            db.notes.insert(cat, function (err) {
                                if (err) {
                                    next(err);
                                } else {
                                    next(null);
                                }
                            });
                        }
                    }
                });
            }
        });
    };

    data.addUser = function (user, next) {
        database.getDb(function (err,db) {
            if (err) {
                console.log(err);
            } else {
                db.users.insert(user, next);
            }
        });
    };

    data.getUser = function(username,next){
         database.getDb(function (err,db) {
            if (err) {
                next(err);
            } else {
                db.users.findOne({username:username}, next);
            }
        });
    };

    function seedDatabase() {
        database.getDb(function (err, db) {
            if (err) {
                console.log(err);
            } else {
                db.notes.count(function (err, count) {
                    if (err) {
                        console.log("Failed to get database count");
                    } else {
                        if (count == 0) {
                            console.log("Seeding database");
                            seedData.initialNotes.forEach(function (item) {
                                db.notes.insert(item, function (err) {
                                    if (err) {
                                        console.log("Failed to insert note into database");
                                    }
                                });
                            });
                        } else {
                            console.log("Database seeded");
                        }
                    }
                });
            }
        });
    }

    seedDatabase();

})(module.exports);