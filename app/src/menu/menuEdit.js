app.controller('MenuEditCtrl', function($scope, $location, $window, $routeParams, $L, rest, notify) {
    $scope.const = $L.const;
    $scope.lconst = {
        Name: $L('Name'),
        DisplayOrder: $L('DisplayOrder')
    }

    var path = $location.path();
    $scope.isModify = (path != '/menuAdd/');
    var id = 0;
    
    if($scope.isModify) {
        id = $routeParams.id;
        rest.endpoint('/menu.json/' + id).get().then(function(resp){
            $scope.menu = resp.data.menu;
        });
    } else {
		$scope.menu = {};
	}

    $scope.back = function() {
        $window.history.back();
    };

    $scope.submit = function(){
        if(!$scope.menu.name) {
            notify.error('名称不能为空');
            return;
        }

        var endpoint = rest.endpoint('/menu.json');
        if($scope.isModify) {
            endpoint.put($scope.menu).then(function(x){
                if(x.result)
                    $location.path('/menu');
            });
        } else {
            endpoint.post($scope.menu).then(function(x){
                if(x.result)
                    $location.path('/menu');
            });
        }
    }
});