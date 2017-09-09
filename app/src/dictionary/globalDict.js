//generator
app.controller('GlobalDictCtrl', function($scope, $location, $L, rest, msgbox, dataPass) {
    $scope.const = $L.const;
    $scope.lconst = {
        Value: $L('Value'),
        Name: $L('Name'),
        Comment: $L('Comment'),
        DictType: $L('Dictionary Type')
    }

    rest.endpoint('/dictType.json').get({global: true}).then(function(resp){
        $scope.types = resp.data.dictTypes;

        var pass = dataPass.getData('gDict');
        if(pass) {
            for(var i = 0; i < $scope.types.length; i++) {
                if($scope.types[i].id == pass.id) {
                    $scope.type = $scope.types[i];
                    refreshData();
                    break;
                }
            }
        }
    });

    function refreshData(){
        rest.endpoint('/globalDict.json').get({typeId: $scope.type.id}).then(function(resp){
            if(resp.result) {
                $scope.globalDicts = resp.data.globalDicts;
            }
        });
    }

    $scope.update = function() {
        dataPass.setData("gDictEdit", $scope.type);

        refreshData();
    }

    $scope.remove = function(idx) {
        msgbox.show().then(function(x){
            if(x) {
                var id = $scope.globalDicts[idx].id;
                rest.endpoint('globalDict.json', id).delete().then(function(resp){
                    if(resp.result);
						$scope.globalDicts.splice(idx, 1);
                });
            }
        });
    }

    $scope.add = function() {
        if($scope.type) {
            dataPass.setData("gDictEdit", $scope.type);
        }
        $location.path("/globalDictAdd");
    };

    $scope.modify = function(idx) {
        $location.path("/globalDictModify/" + $scope.globalDicts[idx].id);
    };
});