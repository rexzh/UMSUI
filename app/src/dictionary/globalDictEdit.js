//generator

app.controller('GlobalDictEditCtrl', function($scope, $location, $window, $routeParams, $L, rest, notify) {
    $scope.const =  $L.const;
    $scope.lconst = {
        Type: $L('Type'),
        Value: $L('Value'),
        Name: $L('Name'),
        Comment: $L('Comment')
    }

    var path = $location.path();
    $scope.isModify = (path != '/globalDictAdd/');
    var id = 0;

    rest.endpoint('/dictType.json/').get({global: true}).then(function(resp){
        $scope.types = resp.data.dictTypes;

        if($scope.isModify) {
            id = $routeParams.id;
            rest.endpoint('/globalDict.json/' + id).get().then(function(resp){
                $scope.globalDict = resp.data.globalDict;

                for(var i = 0; i < $scope.types.length; i++) {
                    if($scope.types[i].id == $scope.globalDict.typeId){
                        $scope.type = $scope.types[i];
                        break;
                    }
                }
            });
        } else {
            $scope.globalDict = {};
        }
    });

    $scope.back = function() {
        $window.history.back();
    };

    $scope.submit = function(){
        if(!$scope.type) {
            notify.error('请选择类型');
            return;
        }

        if(!$scope.globalDict.value) {
            notify.error('值不能为空');
            return;
        }

        if(!$scope.globalDict.name) {
            notify.error('名称不能为空');
            return;
        }

        $scope.globalDict.typeId = $scope.type.id;

        var endpoint = rest.endpoint('/globalDict.json');
        if($scope.isModify) {
            endpoint.put($scope.globalDict).then(function(x){
                if(x.result)
                    $location.path('/globalDict');
            });
        } else {
            endpoint.post($scope.globalDict).then(function(x){
                if(x.result)
                    $location.path('/globalDict');
            });
        }
    }
});