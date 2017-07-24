//generator
app.controller('GlobalDictCtrl', function($scope, $location, $L, rest, msgbox) {
    $scope.const = $L.const;
    $scope.lconst = {
        Value: $L('Value'),
        Name: $L('Name'),
        Comment: $L('Comment'),
        DictType: $L('Dictionary Type')
    }

    rest.endpoint('/dictType.json').get({global: true}).then(function(resp){
        $scope.types = resp.data.dictTypes;
    });

    $scope.update = function() {
        rest.endpoint('/globalDict.json').get({typeId: $scope.type.id}).then(function(resp){
            if(resp.result) {
                //console.log(resp.data);
                $scope.globalDicts = resp.data.globalDicts;
            }
        });
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
        $location.path("/globalDictAdd");
    };

    $scope.modify = function(idx) {
        $location.path("/globalDictModify/" + $scope.globalDicts[idx].id);
    };
});