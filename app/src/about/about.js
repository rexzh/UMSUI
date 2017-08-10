app.controller('AboutCtrl', function ($scope, $L, rest, dataShare) {
    $scope.home = $L("Home");
    $scope.about = $L("About");
    $scope.name = $L(dataShare.getData('brand'));
    $scope.version = $L("Version");

    rest.endpoint('about.json').get().then(function(x){
        $scope.env = x.data.env;
        $scope.vNumber = x.data.version;
        $scope.cpu = x.data.cpu;
        $scope.memory = x.data.memory;
    });
});