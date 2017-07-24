app.controller('SubmenuCtrl', function ($scope, $L, $location, msgbox, rest) {
    $scope.const = $L.const;
    $scope.lconst = {
        Name: $L('Name'),
        Icon: $L('Icon'),
        Link: $L('Link'),
        Localization: $L('Localization'),
        DisplayOrder: $L('DisplayOrder')
    }

    $scope.remove = function(idx) {
        msgbox.show({text: "删除当前记录?"}).then(function(x){
            if(x){
                var id = $scope.submenus[idx].id;
                rest.endpoint('submenu.json/' + id).delete().then(function(x){
                    if(!x.result) {
                        return;
                    }
                    $scope.submenus.splice(idx, 1);
                });

            }
        });
    }

    rest.endpoint('submenu.json').get().then(function(x){
        if(x.result) {
            $scope.submenus = x.data.submenus;

            for(var i = 0; i < $scope.submenus.length; i++) {
                var m = $scope.submenus[i];
                m.namel10n = $L(m.name);
            }
        }
    });

    $scope.add = function() {
        $location.path("/submenuAdd");
    };

    $scope.modify = function(idx) {
        $location.path("/submenuModify/" + $scope.submenus[idx].id);
    };
});