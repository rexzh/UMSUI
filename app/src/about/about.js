app.controller('AboutCtrl', function ($scope, $L, rest) {
    $scope.home = $L("Home");
    $scope.about = $L("About");
    $scope.name = $L("Generic Platform");
    $scope.version = $L("Version");

    rest.endpoint('about.json').get().then(function(x){
        $scope.env = x.data.env;
        $scope.vNumber = x.data.version;
        $scope.cpu = x.data.cpu;
        $scope.memory = x.data.memory;
    });
});