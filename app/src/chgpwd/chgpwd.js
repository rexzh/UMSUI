app.controller('ChgpwdCtrl', function ($scope, $http, $L, rest, notify, dataShare) {

    $scope.chgpwd = $L("Password Setting");
    $scope.save = $L("Save");
    $scope.oldPwdLabel = $L("Old Password");
    $scope.newPwd1Label = $L("New Password");
    $scope.newPwd2Label = $L("New Password Again");

    $scope.newPwd1 = $scope.newPwd2 = $scope.oldPwd = "";
    
    $scope.change = function() {
        if($scope.newPwd1 != $scope.newPwd2) {
            notify.error($L('New password mismatch'));
            return;
        }

        if($scope.newPwd1.length < 6) {
            notify.error($L('Password min length'));
            return;
        }

        rest.endpoint('user.json/chgpwd').put({
            id: dataShare.getData('user').id,
            oldPassword: $scope.oldPwd,
            newPassword: $scope.newPwd1
        }).then(function(x) {
            if(x.result)
                notify.info($L("Save success"));
        });
    }
});