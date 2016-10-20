'use strict';

// Declare app level module which depends on views, and components
angular.module('primetimeApp', [
  'ngRoute',
  'primetimeApp.view1',
  'primetimeApp.view2',
  'ngFacebook'
]).
config(['$locationProvider', '$routeProvider', '$facebookProvider', function($locationProvider, $routeProvider, $facebookProvider) {
  $locationProvider.hashPrefix('!');
  $facebookProvider.setAppId('342239076111236').setPermissions(['manage_pages','publish_pages', 'read_insights', 'read_audience_network_insights']).setVersion("v2.8");
  $routeProvider.otherwise({redirectTo: '/view1'});
}])
.run(['$rootScope', '$window', function($rootScope, $window) {
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}]);
