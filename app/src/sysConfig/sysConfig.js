//generator
app.controller('SysConfigCtrl', function($scope, $location, rest, msgbox) {
    
    rest.endpoint('/sysConfig.json').get().then(function(resp){
        if(resp.result) {
            //console.log(resp.data);
            $scope.sysConfigs = resp.data.sysConfigs;
        }
    });

    $scope.remove = function(idx) {
        msgbox.show().then(function(x){
            if(x) {
                var id = $scope.sysConfigs[idx].id;
                rest.endpoint('sysConfig.json', id).delete().then(function(resp){
                    if(resp.result)
						$scope.sysConfigs.splice(idx, 1);
                });
            }
        });
    }

    $scope.add = function() {
        $location.path("/sysConfigAdd");
    };

    $scope.modify = function(idx) {
        $location.path("/sysConfigModify/" + $scope.sysConfigs[idx].id);
    };
});