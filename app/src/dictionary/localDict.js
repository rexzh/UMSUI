//generator
app.controller('LocalDictCtrl', function($q, $scope, $location, $L, rest, msgbox, dataPass) {
    $scope.const = $L.const;
    $scope.lconst = {
        Value: $L('Value'),
        Name: $L('Name'),
        Comment: $L('Comment'),
        DictType: $L('Dictionary Type'),
        Organization: $L('Organization')
    }

    var pass = dataPass.getData('lDict');
    var q1 = rest.endpoint('/dictType.json').get({global: false}).then(function(resp){
        $scope.types = resp.data.dictTypes;
        
        if(pass && pass.type) {
            for(var i = 0; i < $scope.types.length; i++) {
                if($scope.types[i].id == pass.type.id) {
                    $scope.type = $scope.types[i];
                    
                    break;
                }
            }
        }
    });

    var q2 = rest.endpoint('/organization.json/byUser').get({global: true}).then(function(resp){
        $scope.organizations = resp.data.organizations;
        
        if(pass && pass.org) {
            for(var i = 0; i < $scope.organizations.length; i++) {
                if($scope.organizations[i].id == pass.org.id) {
                    $scope.organization = $scope.organizations[i];
                    
                    break;
                }
            }
        }
    });

    $q.all([q1, q2]).then(function(){
        refreshData();
    });

    function refreshData() {
        if(!$scope.type || !$scope.organization)
            return;
        rest.endpoint('/localDict.json').get({typeId: $scope.type.id, orgId: $scope.organization.id}).then(function(resp){
            if(resp.result) {
                //console.log(resp.data);
                $scope.localDicts = resp.data.localDicts;
            }
        });
    }

    $scope.update = function() {
        if(!$scope.type || !$scope.organization)
            return;

        dataPass.setData('lDictEdit', {type: $scope.type, org: $scope.organization});

        refreshData();
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
        if($scope.type || $scope.organization)
            dataPass.setData('lDictEdit', {type: $scope.type, org: $scope.organization});
        $location.path("/localDictAdd");
    };

    $scope.modify = function(idx) {
        $location.path("/localDictModify/" + $scope.localDicts[idx].id);
    };
});