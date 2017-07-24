//generator
app.controller('LocalDictCtrl', function($scope, $location, $L, rest, msgbox) {
    $scope.const = $L.const;
    $scope.lconst = {
        Value: $L('Value'),
        Name: $L('Name'),
        Comment: $L('Comment'),
        DictType: $L('Dictionary Type'),
        Organization: $L('Organization')
    }

    rest.endpoint('/dictType.json').get({global: false}).then(function(resp){
        $scope.types = resp.data.dictTypes;
    });

    rest.endpoint('/organization.json/byUser').get({global: true}).then(function(resp){
        $scope.organizations = resp.data.organizations;
    });

    $scope.update = function() {
        if(!$scope.type || !$scope.organization)
            return;
        rest.endpoint('/localDict.json').get({typeId: $scope.type.id, orgId: $scope.organization.id}).then(function(resp){
            if(resp.result) {
                //console.log(resp.data);
                $scope.localDicts = resp.data.localDicts;
            }
        });
    }

    $scope.remove = function(idx) {
        msgbox.show().then(function(x){
            if(x) {
                var id = $scope.localDicts[idx].id;
                rest.endpoint('localDict.json', id).delete().then(function(resp){
                    if(resp.result);
						$scope.localDicts.splice(idx, 1);
                });
            }
        });
    }

    $scope.add = function() {
        $location.path("/localDictAdd");
    };

    $scope.modify = function(idx) {
        $location.path("/localDictModify/" + $scope.localDicts[idx].id);
    };
});