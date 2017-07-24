//generator
app.controller('OrganizationCtrl', function($scope, $location, $L, rest, msgbox) {
    $scope.const = $L.const;
    $scope.lconst = {
        Name: $L('Name'),
        Enabled: $L('Enabled'),
        Address: $L('Address'),
        Tel: $L('Tel')
    }

    $scope.page = {
        recordsPerPage: 10
    };

    $scope.criteria = {

    };

    function renderList(page) {
        rest.endpoint('/organization.json').get($scope.criteria, page, $scope.page.recordsPerPage).then(function(resp){
            if(resp.result) {
                $scope.organizations = resp.data.organizations;
                $scope.page.total = resp.data.count;
            }
        });
    };

    $scope.pageChange = function(p) {
        renderList(p);
    };

    $scope.search = function() {
        renderList(1);
    };

    $scope.reset = function() {
        $scope.criteria = {};
    };

    $scope.remove = function(idx) {
        msgbox.show({text: "删除当前记录?"}).then(function(x){
            if(x) {
                var id = $scope.organizations[idx].id;

                rest.endpoint('/organization.json/' + id).delete().then(function(resp){
                    if(resp.result)
                        $scope.organizations.splice(idx, 1);
                });
            }
        });
    }

    $scope.add = function() {
        $location.path("/organizationAdd");
    };

    $scope.modify = function(idx) {
        $location.path("/organizationModify/" + $scope.organizations[idx].id);
    };
});