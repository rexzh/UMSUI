//generator

app.controller('DictTypeEditCtrl', function($scope, $location, $window, $routeParams, $L, rest, notify) {
    $scope.const = $L.const;
    $scope.lconst = {
        Code: $L('Code'),
        Name: $L('Name'),
        Global: $L('Global'),
        Comment: $L('Comment')
    }

    var path = $location.path();
    $scope.isModify = (path != '/dictTypeAdd/');
    var id = 0;
    
    if($scope.isModify) {
        id = $routeParams.id;
        rest.endpoint('/dictType.json/' + id).get().then(function(resp){
            $scope.dictType = resp.data.dictType;
        });
    } else {
        $scope.dictType = {
            global: true
        };
    }

    $scope.back = function() {
        $window.history.back();
    };

    $scope.submit = function(){
        if(!$scope.dictType.name) {
            notify.error('名称不能为空');
            return;
        }

        if(!$scope.dictType.code) {
            notify.error('代码不能为空');
            return;
        }

        var endpoint = rest.endpoint('/dictType.json');
        if($scope.isModify) {
            endpoint.put($scope.dictType).then(function(x){
                if(x.result)
                    $location.path('/dictType');
            });
        } else {
            endpoint.post($scope.dictType).then(function(x){
                if(x.result)
                    $location.path('/dictType');
            });
        }
    }
});