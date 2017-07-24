app.controller('SubmenuEditCtrl', function($scope, $location, $routeParams, $window, $L, rest, notify) {
    $scope.const = $L.const;
    $scope.lconst = {
        Name: $L('Name'),
        Icon: $L('Icon'),
        Link: $L('Link'),
        Localization: $L('Localization'),
        DisplayOrder: $L('DisplayOrder'),
        ParentMenu: $L('ParentMenu')
    }

    var path = $location.path();
    $scope.isModify = (path != '/submenuAdd/');
    var id = 0;

    rest.endpoint('/menu.json').get().then(function(x){
        $scope.lv1menus = x.data.menus;
        if($scope.isModify) {
            id = $routeParams.id;
            rest.endpoint('/submenu.json/' + id).get().then(function(resp){
                $scope.submenu = resp.data.submenu;

                for(var i = 0; i < $scope.lv1menus.length; i++) {
                    if($scope.lv1menus[i].id == $scope.submenu.parentId) {
                        $scope.lv1menu = $scope.lv1menus[i];
                        break;
                    }
                }

            });
        } else {
            $scope.submenu = {};
        }
    });

    $scope.back = function() {
        $window.history.back();
    };

    $scope.submit = function(){
        if(!$scope.submenu.name) {
            notify.error('菜单名称不能为空');
            return;
        }

        if(!$scope.submenu.link) {
            notify.error('链接不能为空');
            return;
        }

        if(!$scope.lv1menu) {
            notify.error('请选择上级菜单');
            return;
        } else {
            $scope.submenu.parentId = $scope.lv1menu.id;
        }

        if(isNaN(parseInt($scope.submenu.displayOrder))) {
            notify.error('显示顺序必须是数字');
            return;
        }


        if($scope.isModify) {
            rest.endpoint('/submenu.json').put($scope.submenu).then(function(x){
                if(x.result)
                    $location.path('/submenu');
            });
        } else {
            rest.endpoint('/submenu.json').post($scope.submenu).then(function(x){
                if(x.result)
                    $location.path('/submenu');
            });
        }
    }
});