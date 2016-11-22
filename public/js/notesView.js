//notesview.js

(function (angular) {

    var theModule = angular.module("notesView", ["ui.bootstrap"]);
    theModule.controller("notesViewController", ["$scope", "$window", "$http",
        function ($scope, $window, $http) {

            var urlParts = $window.location.pathname.split("/");
            var categoryName = urlParts[urlParts.length - 1];
            var notesUrl = "/api/getnotes/" + categoryName;
            $http.get(notesUrl)
                .then(function (result) {
                    console.log(result);
                    $scope.notes = result.data;
                    $scope.newNote = createBlankNote();
                }, function (err) {
                    alert(err);
                });

            var socket = io.connect();

            socket.emit("joinCategory", categoryName);

            socket.on("broadcastNote", function (note) {
                $scope.notes.push(note);
                $scope.$apply();
            });


            $scope.save = function () {
                var notePostUrl = "/api/notes/" + categoryName;
                console.log("in save:" + $scope.newNote.note + $scope.newNote.color);
                $http.post(notePostUrl, $scope.newNote).
                then(function (result) {
                    $scope.notes.push(result.data);
                    $scope.newNote = createBlankNote();
                    socket.emit("newNote", {
                        category: categoryName,
                        note: result.data
                    });
                }, function (err) {
                    alert(err);
                });
            };
        }
    ]);

    function createBlankNote() {
        return {
            note: "",
            color: "red"
        };
    }

})(window.angular);