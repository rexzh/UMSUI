'use strict';

app.controller('UploadCtrl', function($scope, $location, $window, $routeParams, $L, rest, notify) {
    $scope.const = $L.const;

    $scope.submit = function(){
        var formData = new FormData();
        formData.append('target', $scope.file);

        rest.endpoint('/upload.json').post(formData, {
            //transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(function(){
            console.log("!!!!!");
        });
    };
});