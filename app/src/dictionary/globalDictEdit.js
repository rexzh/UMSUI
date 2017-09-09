//generator

app.controller('GlobalDictEditCtrl', function($scope, $location, $window, $routeParams, $L, rest, notify, dataPass) {
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

    function resetDropdown(id) {
        for(var i = 0; i < $scope.types.length; i++) {
            if($scope.types[i].id == id){
                $scope.type = $scope.types[i];
                break;
            }
        }
    }

    rest.endpoint('/dictType.json/').get({global: true}).then(function(resp){
        $scope.types = resp.data.dictTypes;

        if($scope.isModify) {
            id = $routeParams.id;
            rest.endpoint('/globalDict.json/' + id).get().then(function(resp){
                $scope.globalDict = resp.data.globalDict;
                
                resetDropdown($scope.globalDict.typeId);
            });
        } else {
            $scope.globalDict = {};
            var pass = dataPass.getData("gDictEdit");
            
            if(pass) {
                resetDropdown(pass.id);
            }
        }
    });

    $scope.back = function() {
        dataPass.setData('gDict', $scope.type);
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

        if(!$.isNumeric($scope.globalDict.value)) {
            notify.error('值必须为数字');
            return;
        }

        if(!$scope.globalDict.name) {
            notify.error('名称不能为空');
            return;
        }

        $scope.globalDict.typeId = $scope.type.id;
        dataPass.setData('gDict', $scope.type);

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