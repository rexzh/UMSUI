//generator
app.controller('SysConfigCtrl', function($scope, $location, $L, rest, msgbox) {
    $scope.const = $L.const;
    $scope.lconst = {
        Key: $L('Key'),
        Value: $L('Value')
    };
    
    rest.endpoint('/sysConfig.json').get().then(function(resp){
        if(resp.result) {
            $scope.sysConfigs = resp.data.sysConfigs;
            $scope.editable = new Array(resp.data.sysConfigs.length);
            for(var i = 0; i < $scope.editable.length; i++) {
                $scope.edit[i] = false;
            }
        }
    });

    $scope.edit = function(idx) {
        for(var i = 0; i < $scope.editable.length; i++) {
            $scope.editable[i] = false;
        }
        $scope.editable[idx] = true;
    };

    $scope.cancel = function(idx) {
        $scope.editable[idx] = false;
    };

    $scope.save = function(idx) {
        rest.endpoint('sysConfig.json').put($scope.sysConfigs[idx]).then(function(x){
            $scope.editable[idx] = false;
        });
    };
});