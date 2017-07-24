//generator
app.controller('MenuCtrl', function($scope, $location, $L, rest, msgbox) {
    $scope.const = $L.const;
    $scope.lconst = {
        Name: $L('Name'),
        Localization: $L('Localization'),
        DisplayOrder: $L('DisplayOrder')
    }
    
    rest.endpoint('/menu.json').get().then(function(resp){
        if(resp.result) {
            //console.log(resp.data);
            $scope.menus = resp.data.menus;

            for(var i = 0; i < $scope.menus.length; i++) {
                var m = $scope.menus[i];
                m.namel10n = $L(m.name);
            }
        }
    });

    $scope.remove = function(idx) {
        msgbox.show().then(function(x){
            if(x) {
                var id = $scope.menus[idx].id;
                rest.endpoint('menu.json', id).delete().then(function(resp){
                    if(resp.result)
						$scope.menus.splice(idx, 1);
                });
            }
        });
    }

    $scope.add = function() {
        $location.path("/menuAdd");
    };

    $scope.modify = function(idx) {
        $location.path("/menuModify/" + $scope.menus[idx].id);
    };
});