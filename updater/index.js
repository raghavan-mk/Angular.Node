//updates/index.js

(function (updater) {

    var socketio = require("socket.io");

    updater.init = function (server) {
        var io = socketio.listen(server);
        io.sockets.on("connection",function(socket){
            console.log("Socket was connected");
            
            socket.on("joinCategory",function(category){
                socket.join(category);
            });

            socket.on("newNote",function(data){
                socket.broadcast.to(data.category).emit("broadcastNote",data.note);
            });
        });
    };

})(module.exports);