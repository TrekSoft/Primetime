let app = angular.module('primetimeApp', [
  'ngRoute',
  'primetimeApp.main',
  'ngFacebook',
  'ngMaterial'
]).
config([
    '$routeProvider',
    '$facebookProvider',
    '$mdThemingProvider',
    'FB_CONFIG',

    function(
        $routeProvider,
        $facebookProvider,
        $mdThemingProvider,
        FB_CONFIG
    ) {
        $routeProvider.otherwise({redirectTo: '/main'});

        $facebookProvider.setAppId(FB_CONFIG.APP_ID).setPermissions(FB_CONFIG.PERMISSIONS).setVersion(FB_CONFIG.VERSION);

        $mdThemingProvider.theme('default')
            .primaryPalette('pink', { 'default': '800', 'hue-1': '100', 'hue-2': '600', 'hue-3': 'A100' })
            .accentPalette('blue', { 'default': 'A700' });
    }
])
.run([
    '$rootScope',
    '$window',

    function(
        $rootScope,
        $window
    ) {
        (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s); js.id = id;
          js.src = "//connect.facebook.net/en_US/sdk.js";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
]);
