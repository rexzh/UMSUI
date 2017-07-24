'use strict';

app.controller('UserCtrl', function($scope, $location, $L, msgbox, notify, rest) {
    $scope.const = $L.const;
    $scope.lconst = {
        UserCode: $L('UserCode'),
        UserName: $L('UserName'),
        Enabled: $L('Enabled'),
        Role: $L('Role'),
        ResetPwd: $L('ResetPassword')
    }

    $scope.page = {
        recordsPerPage: 10
    };

    $scope.criteria = {
    };

    function renderList(page) {
        rest.endpoint('/user.json').get($scope.criteria, page, $scope.page.recordsPerPage).then(function(resp){
            if(resp.result) {
                $scope.users = resp.data.users;
                $scope.page.total = resp.data.count;
            }
        });
    };

    $scope.pageChange = function(p) {
        renderList(p);
    };

    $scope.search = function() {
        renderList(1);
    };

    $scope.reset = function() {
        $scope.criteria = {};
    };

    $scope.remove = function(idx) {
        msgbox.show({text: "删除当前记录?"}).then(function(x){
            if(x) {
                var id = $scope.users[idx].id;
                rest.endpoint('user.json', id).delete().then(function(resp){
                    if(resp.result)
                        $scope.users.splice(idx, 1);
                });
            }
        });
    };

    $scope.add = function() {
        $location.path("/userAdd");
    };

    $scope.modify = function(idx) {
        $location.path("/userModify/" + $scope.users[idx].id);
    };

    $scope.resetPwd = function(idx) {
        rest.endpoint('user.json/reset/', $scope.users[idx].id).put().then(function(resp){
            if(resp.result) {
                var pwd = resp.data.password;
                msgbox.show({text: "密码重置为：" + pwd});
            }
        });
    }
});