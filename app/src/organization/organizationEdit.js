//generator

app.controller('OrganizationEditCtrl', function($scope, $location, $window, $routeParams, $L, rest, notify) {
    $scope.const = $L.const;
    $scope.lconst = {
        Name: $L('Name'),
        Enabled: $L('Enabled'),
        Address: $L('Address'),
        Tel: $L('Tel')
    }

    var path = $location.path();
    $scope.isModify = (path != '/organizationAdd/');
    var id = 0;

    if($scope.isModify) {
        id = $routeParams.id;
        rest.endpoint('organization.json/' + id).get().then(function(resp){
            $scope.organization = resp.data.organization;
        });
    } else {
        $scope.organization = {
            enabled: true
        };
    }

    $scope.back = function() {
        $window.history.back();
    };

    $scope.submit = function(){
        if(!$scope.organization.name) {
            notify.error('名称不能为空');
            return;
        }

        var endpoint = rest.endpoint('/organization.json');
        if($scope.isModify) {
            endpoint.put($scope.organization).then(function(x){
                if(x.result)
                    $location.path('/organization');
            });
        } else {
            endpoint.post($scope.organization).then(function(x){
                if(x.result)
                    $location.path('/organization');
            });
        }
    }
});