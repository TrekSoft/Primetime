'use strict';

angular.module('primetimeApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$facebook', 'User', 'Page', function($scope, $facebook, User, Page) {
    $scope.status = null;
    $scope.user = null;
    $scope.pages = [];
    $scope.chosenPage = null;
    $scope.posts = null;
    $scope.fanData = null;

    $scope.login = function() {
        $facebook.login();
    };

    $scope.selectPage = function(page) {
        $scope.chosenPage = page;

        page.getPosts().then(function(response) {
            $scope.posts = response;
        });

        page.getFanData().then(function(response) {
            $scope.fanData = response;
        });
    }

    $scope.$on('fb.auth.authResponseChange', function() {
      $scope.status = $facebook.isConnected();

      if($scope.status) {
          $scope.user = new User();
          $scope.user.load().then(
              function(){
                  $scope.user.getPages();
              }
          );
      }
    });
}]);


/*
$facebook.api('/418754271481410?fields=access_token').then(function(user) {
    $facebook.api('/418754271481410/insights/page_fans_online').then(function(user) {
        console.log(user);
    });
});
*/
