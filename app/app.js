let app = angular.module('primetimeApp', [
  'ngRoute',
  'primetimeApp.view1',
  'primetimeApp.view2',
  'ngFacebook',
  'ngMaterial'
]).
config([
    '$routeProvider',
    '$facebookProvider',
    '$mdThemingProvider',

    function(
        $routeProvider,
        $facebookProvider,
        $mdThemingProvider
    ) {
        $routeProvider.otherwise({redirectTo: '/view1'});

        $facebookProvider.setAppId('342239076111236').setPermissions([
            'manage_pages',
            'publish_pages',
            'read_insights',
            'read_audience_network_insights'
        ]).setVersion("v2.8");

        $mdThemingProvider.theme('default')
            .primaryPalette('pink', { 'default': '800', 'hue-1': '100', 'hue-2': '600', 'hue-3': 'A100' })
            .accentPalette('cyan', { 'default': 'A700' });
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
