app.controller('SysConfigEditCtrl', function($scope, $location, $window, $routeParams, rest, notify) {
    var path = $location.path();
    $scope.isModify = (path != '/sysConfigAdd/');
    var id = 0;
    
    if($scope.isModify) {
        id = $routeParams.id;
        rest.endpoint('/sysConfig.json/' + id).get().then(function(resp){
            $scope.sysConfig = resp.data.sysConfig;
        });
    } else {
		$scope.sysConfig = {};
	}

    $scope.back = function() {
        $window.history.back();
    };

    $scope.submit = function(){
        //TODO:Verify
		
		if(!$scope.sysConfig.id) {
			notify.error('id����Ϊ��');
			return;
		}
		
		if(!$scope.sysConfig.cfgKey) {
			notify.error('cfgKey����Ϊ��');
			return;
		}
		
		if(!$scope.sysConfig.cfgValue) {
			notify.error('cfgValue����Ϊ��');
			return;
		}
		

        var endpoint = rest.endpoint('/sysConfig.json');
        if($scope.isModify) {
            endpoint.put($scope.sysConfig).then(function(x){
                if(x.result)
                    $location.path('/sysConfig');
            });
        } else {
            endpoint.post($scope.sysConfig).then(function(x){
                if(x.result)
                    $location.path('/sysConfig');
            });
        }
    }
});