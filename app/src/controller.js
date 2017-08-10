app.controller('NavCtrl', function ($scope, $L, rest, $window, dataShare) {
    
    $scope.userRole = $L("UserRole");
    $scope.logoutLabel = $L("Logout");
    $scope.selectOrg = $L("Select Organization");

    $scope.$on('login', function(msg, data){
        $scope.env = data.env;
        $scope.user = data.user;
        $scope.organizations = data.user.organizations;

        $scope.user.currentOrg = data.user.currentOrganization;

        dataShare.setData('user', $scope.user);
        
        //TODO:!!
        $scope.brand = $L(dataShare.getData('brand'));
    });

    $scope.logout = function(msg, data){
        $scope.user = {};
        $scope.organizations = [];
        $scope.user.currentOrg = {name: $L('Please Select')};
        dataShare.setData('user', null);

        rest.endpoint('logout.json').get().then(function(x){
            $window.location.assign("./login.html");
        });
    };

    $scope.select = function(idx) {
        var selectedOrg = $scope.organizations[idx];
        rest.endpoint('/currentOrg.json').post(selectedOrg).then(function(x){
            if(x.result) {
                $scope.user.currentOrg = selectedOrg;
                $window.location.assign("./index.html");
            }
        });
    }
});

app.controller('SystemStatusCtrl', function ($scope, $location, $window, $L, $timeout, routes, dataShare, resetMenu) {
    $scope.resetMenu = resetMenu;
    $scope.home = $L("Home");

    $scope.$on('login', function() {
        var path = $location.path();

        for(var i = 0; i < routes.length; i++) {
            var when = routes[i].when;
            var s = when.substr(when.length - 4);
            if(s == '/:id')
                when = when.substr(0, when.length - 3);


            if(path.indexOf(when) >= 0) {
                $scope.breadcrumb = $L(routes[i].name);
            }

        }

        if(!$scope.breadcrumb)
            $scope.breadcrumb = '404';
    });

    $scope.showWait = false;
    $scope.showMessage = false;
    $scope.showDetail = true;
    $scope.icon = 'icon-chevron-up';

    function showMessage() {
        $scope.showMessage = true;
        if($scope.showDetail && $scope.message.type == 'error')
            $scope.toggleDetail();
        if((!$scope.showDetail) && $scope.message.type != 'error')
            $scope.toggleDetail();
    }

    $scope.message = {
        type: 'success',
        head: 'Attention',
        detail: $L('Success')
    };

    $scope.hide = function() {
        $scope.showMessage = false;
    };

    $scope.toggleDetail = function() {
        if($scope.showDetail) {
            $scope.icon = 'icon-chevron-down';
            $scope.showDetail = false;
        } else {
            $scope.icon = 'icon-chevron-up';
            $scope.showDetail = true;
        }
    };

    $scope.$on('menuChange', function(evt, data){
        $scope.breadcrumb = data.name;
    });

    $scope.$on('ajaxStart', function(){
        $scope.showWait = true;
        $scope.showMessage = false;
    });

    $scope.$on('ajaxEnd', function(){
        $scope.showWait = false;
    });

    $scope.$on('notify', function(evt, msg) {
        $scope.message = {
            type: msg.type,
            detail: msg.text,
            head: $L('Attention')
        }
        showMessage();
        if(msg.type == "success") {
            $timeout(function(){
                $scope.showMessage = false;
            }, 3000);
        }
    });

    $scope.$on('serviceSuccess', function(evt, resp) {
        if(resp.data && resp.data.result === false) {
            console.log(resp.data);
            $scope.message = {
                type: 'error',
                head: $L(resp.data.data.error),
                detail: JSON.stringify(resp.data.data.stack)
            }
            showMessage();
        }
    });

    $scope.$on('serviceFailure', function(evt, resp) {
        $scope.message = {
            type: 'error',
            head: $L('Error'),
            detail: JSON.stringify(resp)
        }
        showMessage();
    });

    $scope.$on('logout', function(){
        $window.location.assign("./login.html");
    })
});

app.controller('NavMenuCtrl', function ($rootScope, $scope, $window, $timeout, $q, $L, rest, resetMenu, dataShare) {
    var loginData = null;
    var indexPromise = rest.endpoint('/index.json').get().then(function(x){
        if(x.result) {
            var menus = x.data.menus;

            for(var i = 0; i < menus.length; i++) {
                var mn = menus[i];
                mn.name = $L(mn.name);
                for(var j = 0; j < mn.submenus.length; j++) {
                    var itm = mn.submenus[j];
                    itm.name = $L(itm.name);
                }
            }

            $scope.menus = menus;
            dataShare.setData('menus', menus);
            //TODO:Refactor
            loginData = x.data;
        } else {
            if(x.data.error && x.data.error == 'NotLogin') {
                $window.location.assign("./login.html");
            }
        }
    });

    var cfgPromise = rest.endpoint('sysConfig.json').get().then(function(x){
        var cfgs = x.data.sysConfigs;
        for(var i = 0; i < cfgs.length; i++) {
            dataShare.setData(cfgs[i].cfgKey, cfgs[i].cfgValue);
        }

        $window.document.title = $L(dataShare.getData('brand'));
    });

    
    $q.all([indexPromise, cfgPromise]).then(function() {
        $rootScope.$broadcast('login', loginData);
        $timeout(function(){
            resetMenu();
        }, 0);
    });
});