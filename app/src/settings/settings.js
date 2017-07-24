app.controller('SettingsCtrl', function ($scope, $window, $interval, $L) {

    $scope.settings = $L("Settings");
    $scope.language = $L("Language");
    $scope.timezone = $L("TimeZone");
    $scope.apply = $L("Apply");
    $scope.ms = $L("ms");

    var lang = localStorage.getItem('lang') || 'en_us';
    $scope.selectedLanguage = $('a[data-language="' + lang + '"]').first().text();

    $scope.selLanguage = function (lang) {
        localStorage.setItem('lang', lang);
        $scope.selectedLanguage = $('a[data-language="' + lang + '"]').first().text();
    }


    var tz = parseFloat(localStorage.getItem('tz')) || 8;
    $('#timezone').first().val(tz);

    $scope.applyChange = function () {

        var t = $('#timezone').first().val();
        localStorage.setItem('tz', t);

        $window.location.reload();
    }
});