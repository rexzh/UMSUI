//generator

app.controller('LocalDictEditCtrl', function($q, $scope, $location, $window, $routeParams, $L, dataShare, dataPass, rest, notify) {
    $scope.const = $L.const;
    $scope.lconst = {
        Organization: $L('Organization'),
        Type: $L('Type'),
        Value: $L('Value'),
        Name: $L('Name'),
        Comment: $L('Comment')
    }

    var path = $location.path();
    $scope.isModify = (path != '/localDictAdd/');
    var id = 0;

    var q1 = rest.endpoint('/dictType.json/').get({global: false}).then(function(resp){
        $scope.types = resp.data.dictTypes;
    });

    var q2 = rest.endpoint('/organization.json/byUser').get().then(function(resp){
        $scope.organizations = resp.data.organizations;
    });

    function resetDropdown(typeId, orgId) {
        if(typeId) {
            for(var i = 0; i < $scope.types.length; i++) {
                if($scope.types[i].id == typeId) {
                    $scope.type = $scope.types[i];
                    break;
                }
            }
        }

        if(orgId) {
            for(var i = 0; i < $scope.organizations.length; i++) {
                if($scope.organizations[i].id == orgId) {
                    $scope.organization = $scope.organizations[i];
                    break;
                }
            }
        }
    }

    $q.all([q1, q2]).then(function(){
        if($scope.isModify) {
            id = $routeParams.id;
            rest.endpoint('/localDict.json/' + id).get().then(function(resp){
                $scope.localDict = resp.data.localDict;

                resetDropdown($scope.localDict.typeId, $scope.localDict.orgId);
            });
        } else {
            $scope.localDict = {};

            var pass = dataPass.getData("lDictEdit");
            if(pass) {
                pass.type
                resetDropdown(pass.type ? pass.type.id : null, pass.org ? pass.org.id : null);
            }
        }
    });

    $scope.back = function() {
        dataPass.setData('lDict', {type: $scope.type, org: $scope.organization});
        $window.history.back();
    };

    $scope.submit = function(){
        if(!$scope.type) {
            notify.error('请选择类型');
            return;
        }

        if(!$scope.organization) {
            notify.error('请选择机构');
            return;
        }

        if(!$scope.localDict.value) {
            notify.error('值不能为空');
            return;
        }

        if(!$.isNumeric($scope.localDict.value)) {
            notify.error('值必须为数字');
            return;
        }

        if(!$scope.localDict.name) {
            notify.error('名称不能为空');
            return;
        }

        $scope.localDict.orgId = $scope.organization.id;
        $scope.localDict.typeId = $scope.type.id;

        dataPass.setData('lDict', {type: $scope.type, org: $scope.organization});

        var endpoint = rest.endpoint('/localDict.json');
        if($scope.isModify) {
            endpoint.put($scope.localDict).then(function(x){
                if(x.result)
                    $location.path('/localDict');
            });
        } else {
            endpoint.post($scope.localDict).then(function(x){
                if(x.result)
                    $location.path('/localDict');
            });
        }
    }
});