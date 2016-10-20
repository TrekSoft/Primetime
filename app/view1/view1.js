'use strict';

angular.module('primetimeApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$facebook', function($scope, $facebook) {
    $scope.login = function() {
        $facebook.login();
    };

    $scope.$on('fb.auth.authResponseChange', function() {
      $scope.status = $facebook.isConnected();

      if($scope.status) {
        $facebook.api('/418754271481410?fields=access_token').then(function(user) {
            $facebook.api('/418754271481410/insights/page_fans_online').then(function(user) {
                console.log(user);
            });
        });
      }
    });
}]);
