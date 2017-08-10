var app = angular.module('LoginModule', ['http.service', 'l10n'])
.config(function($LProvider){
    var lang = localStorage.getItem('lang');
    if(lang)
        $LProvider.setLocale(lang);
    else
        $LProvider.setLocale('zh_cn');
})
.run(function(rest) {
    var base_url = '/management/';
    //var base_url = 'localhost:8000/management/';
    rest.init(base_url);
});

app.controller('LoginCtrl', function($scope, $window, rest){
    $scope.username='admin';
    $scope.password='111111';
    $scope.hasError=false;

    $scope.login = function() {
        $scope.hasError=false;
        rest.endpoint('index.json').post({
            username: $scope.username,
            password: $scope.password
        }).then(function(x) {
            if(x.result && x.data.login) {
                $window.location.assign("./index.html");
            } else {
                $scope.hasError=true;
                $scope.reason='Username or Password wrong';
            }
        },function(err){
            $scope.hasError=true;
            $scope.reason='Server fail';
        });
    }
});