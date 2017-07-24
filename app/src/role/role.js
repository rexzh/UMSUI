'use strict';

app.controller('RoleCtrl', function($scope, $location, $L, rest, msgbox) {
    $scope.const = $L.const;
    $scope.lconst = {
        Name: $L('Name'),
        Enabled: $L('Enabled'),
        Register: $L('Register'),
        Description: $L('Description')
    }

    rest.endpoint('/role.json').get().then(function(resp){
        if(resp.result) {
            //console.log(resp.data);
            $scope.roles = resp.data.roles;
        }
    });

    $scope.remove = function(idx) {
        msgbox.show({text: "删除当前记录?"}).then(function(x){
            if(x) {
                var id = $scope.roles[idx].id;
                rest.endpoint('role.json/' + id).delete().then(function(resp){
                    if(resp.result)
                        $scope.roles.splice(idx, 1);
                });
            }
        });
    }

    $scope.add = function() {
        $location.path("/roleAdd");
    };

    $scope.modify = function(idx) {
        $location.path("/roleModify/" + $scope.roles[idx].id);
    };
});