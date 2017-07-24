var app = angular.module('AppModule', ['ngRoute', 'http.service', 'common', 'metro.directive', 'l10n']);

app.constant('resetMenu', function () {
    var path = window.location.hash;
    if(path[path.length - 1] == '/') path = path.substr(0, path.length - 1);

    var mn = $("#sidebar-left").first();
    mn.find("a").each(function () {
        if ($(this).attr('href') == path)
            $(this).parent().addClass('active');
        else
            $(this).parent().removeClass('active');
    });
});

app.constant('resize', function(){
    var winHeight = $(window).height();
    var winWidth = $(window).width();

    var contentHeight = $("#content").height();

    if (winHeight) {
        //console.log("resize to winHeight");
        $("#content").css("min-height", winHeight/* - 41 * 2 - 6*/);
    }

    if (contentHeight) {
        //console.log("resize to contentHeight");
        $("#sidebar-left").css("height", (winHeight > contentHeight) ? winHeight : contentHeight);
    }
});

app.constant('routes', [
    {when: '/settings/', templateUrl: './src/settings/settings.html', controller: 'SettingsCtrl', name: 'Settings'},
    {when: '/about/', templateUrl: './src/about/about.html', controller: 'AboutCtrl', name: 'About'},
    {when: '/chgpwd/', templateUrl: './src/chgpwd/chgpwd.html', controller: 'ChgpwdCtrl', name: 'Password Settings'},
    {when: '/user/', templateUrl: './src/user/user.html', controller: 'UserCtrl', name: 'User'},
    {when: '/userAdd/', templateUrl: './src/user/userEdit.html', controller: 'UserEditCtrl', name: 'User'},
    {when: '/userModify/:id', templateUrl: './src/user/userEdit.html', controller: 'UserEditCtrl', name: 'User'},
    {when: '/role/', templateUrl: './src/role/role.html', controller: 'RoleCtrl', name: 'Role'},
    {when: '/roleAdd/', templateUrl: './src/role/roleEdit.html', controller: 'RoleEditCtrl', name: 'Role'},
    {when: '/roleModify/:id', templateUrl: './src/role/roleEdit.html', controller: 'RoleEditCtrl', name: 'Role'},
    {when: '/organization/', templateUrl: './src/organization/organization.html', controller: 'OrganizationCtrl', name: 'Organization'},
    {when: '/organizationAdd/', templateUrl: './src/organization/organizationEdit.html', controller: 'OrganizationEditCtrl', name: 'Organization'},
    {when: '/organizationModify/:id', templateUrl: './src/organization/organizationEdit.html', controller: 'OrganizationEditCtrl', name: 'Organization'},
    {when: '/menu/', templateUrl: './src/menu/menu.html', controller: 'MenuCtrl', name: 'Menu'},
    {when: '/menuAdd/', templateUrl: './src/menu/menuEdit.html', controller: 'MenuEditCtrl', name: 'Menu'},
    {when: '/menuModify/:id', templateUrl: './src/menu/menuEdit.html', controller: 'MenuEditCtrl', name: 'Menu'},
    {when: '/submenu/', templateUrl: './src/menu/submenu.html', controller: 'SubmenuCtrl', name: 'Submenu'},
    {when: '/submenuAdd/', templateUrl: './src/menu/submenuEdit.html', controller: 'SubmenuEditCtrl', name: 'Submenu'},
    {when: '/submenuModify/:id', templateUrl: './src/menu/submenuEdit.html', controller: 'SubmenuEditCtrl', name: 'Submenu'},
    {when: '/dictType/', templateUrl: './src/dictionary/dictType.html', controller: 'DictTypeCtrl', name: 'Dictionary Type'},
    {when: '/dictTypeAdd/', templateUrl: './src/dictionary/dictTypeEdit.html', controller: 'DictTypeEditCtrl', name: 'Dictionary Type'},
    {when: '/dictTypeModify/:id', templateUrl: './src/dictionary/dictTypeEdit.html', controller: 'DictTypeEditCtrl', name: 'Dictionary Type'},
    {when: '/globalDict/', templateUrl: './src/dictionary/globalDict.html', controller: 'GlobalDictCtrl', name: 'Global Dictionary'},
    {when: '/globalDictAdd/', templateUrl: './src/dictionary/globalDictEdit.html', controller: 'GlobalDictEditCtrl', name: 'Global Dictionary'},
    {when: '/globalDictModify/:id', templateUrl: './src/dictionary/globalDictEdit.html', controller: 'GlobalDictEditCtrl', name: 'Global Dictionary'},
    {when: '/localDict/', templateUrl: './src/dictionary/localDict.html', controller: 'LocalDictCtrl', name: 'Local Dictionary'},
    {when: '/localDictAdd/', templateUrl: './src/dictionary/localDictEdit.html', controller: 'LocalDictEditCtrl', name: 'Local Dictionary'},
    {when: '/localDictModify/:id', templateUrl: './src/dictionary/localDictEdit.html', controller: 'LocalDictEditCtrl', name: 'Local Dictionary'},
    {when: '/upload', templateUrl: './src/upload/upload.html', controller: 'UploadCtrl', name: 'Upload'},
    {when: '/404/', templateUrl: './src/404.html'}
]);

app.config(function ($routeProvider, $LProvider, routes) {
    var lang = localStorage.getItem('lang');
    if(lang)
        $LProvider.setLocale(lang);
    else
        $LProvider.setLocale('zh_cn');

    for(var i = 0; i < routes.length; i++){
        var r = routes[i];
        $routeProvider.when(r.when, {templateUrl: r.templateUrl, controller: r.controller});
    }

    $routeProvider.otherwise({
        redirectTo: '/404/'
    });
}).config(['$httpProvider', function($httpProvider) {
	$httpProvider.interceptors.push('ajaxInterceptor');
}]).run(function(resize, rest) {
    var base_url = '/management/';
    //var base_url = 'localhost:8000/management/';
    rest.init(base_url);
    resize();
    $(window).bind("resize", resize);
});