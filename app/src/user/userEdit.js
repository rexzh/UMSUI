'use strict';

app.controller('UserEditCtrl', function($scope, $location, $window, $routeParams, $L, rest, dataShare, notify) {
    $scope.const = $L.const;
    $scope.lconst = {
        UserCode: $L('UserCode'),
        UserName: $L('UserName'),
        Enabled: $L('Enabled'),
        Role: $L('Role'),
        Organization: $L('Organization'),
    }

    var path = $location.path();
    $scope.isModify = (path != '/userAdd/');
    var id = 0;

    rest.endpoint('/organization.json/byUser').get().then(function(resp){
        $scope.orgs = resp.data.organizations;

        rest.endpoint('/role.json').get().then(function(resp){
            $scope.roles = resp.data.roles;
            if($scope.isModify) {
                id = $routeParams.id;
                rest.endpoint('/user.json/' + id).get().then(function(resp){
                    $scope.user = resp.data.user;

                    var role = $scope.user.role;

                    for(var i = 0; i < $scope.roles.length; i++) {
                        if($scope.roles[i].id == role.id) {
                            $scope.role = $scope.roles[i];
                            break;
                        }
                    }

                    for(var i = 0; i < $scope.orgs.length; i++) {
                        for(var j = 0; j < $scope.user.organizations.length; j++) {
                            var related_org = $scope.user.organizations[j];
                            if(related_org.id == $scope.orgs[i].id) {
                                $scope.orgs[i].checked = true;
                            }
                        }
                    }
                });
            } else {
                $scope.user = {
                    enabled: true
                };
            }
        });
    });

    $scope.back = function() {
        $window.history.back();
    };

    $scope.submit = function(){
        if(!$scope.user.code) {
            notify.error('用户名不能为空');
            return;
        }

        if(!$scope.role) {
            notify.error('角色不能为空');
            return;
        }
        $scope.user.role = $scope.role;


        $scope.user.organizations = [];
        for(var i = 0; i < $scope.orgs.length; i++) {
            var org = $scope.orgs[i];
            if(org.checked)
                $scope.user.organizations.push(org);
        }

        if($scope.isModify) {
            rest.endpoint('user.json').put($scope.user).then(function(x){
                if(x.result)
                    $location.path('/user');
            });
        } else {
            rest.endpoint('user.json').post($scope.user).then(function(x){
                if(x.result)
                    $location.path('/user');
            });
        }
    };

});