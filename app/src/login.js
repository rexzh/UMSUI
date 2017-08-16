var login = angular.module('LoginModule', ['http.service', 'l10n'])
.constant('resize', function(){
    var winHeight = $(window).height();

    if (winHeight) {
        console.log(winHeight);
        $("#login").css("min-height", winHeight - 46);
    }
})
.config(function($LProvider){
    var lang = localStorage.getItem('lang');
    if(lang)
        $LProvider.setLocale(lang);
    else
        $LProvider.setLocale('zh_cn');
})
.run(function(rest, resize) {
    var base_url = '/management/';
    //var base_url = 'localhost:8000/management/';
    rest.init(base_url);
    resize();
    $(window).bind("resize", resize);
    $("footer").show();
});

login.controller('FooterCtrl', function($scope, $window, $L, rest){
    rest.endpoint('sysConfig.json').get().then(function(x){
        var cfg = {};
        var arr = x.data.sysConfigs;
        for(var i = 0; i < arr.length; i++) {
            cfg[arr[i].cfgKey] = arr[i].cfgValue;
        }
        
        $scope.brand = cfg['brand'];
        $scope.trademark = cfg['trademark'];
        $scope.copyright = cfg['copyright'];
        $scope.link = cfg['link'];
        $scope.company = cfg['company'];
        $scope.register = cfg['register'];

        $window.document.title = $L(cfg['brand']);
    });
});

login.controller('LoginCtrl', function($scope, $window, rest){
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