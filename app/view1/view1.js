'use strict';

angular.module('primetimeApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$facebook', 'Page', function($scope, $facebook, Page) {
    $scope.status = null;
    $scope.pages = [];
    $scope.chosenPage = null;
    $scope.loadingPage = false;

    $scope.login = function() {
        $facebook.login();
    };

    $scope.selectPage = function(page) {
        $scope.loadingPage = true;

        page.getPosts().then(function(response) {
            console.log(response);
        });

        page.getFans().then(function(response) {
            $scope.chosenPage = page;
            $scope.loadingPage = false;
            console.log(response);
            // 418754271481410/posts?fields=object_id,message,is_published,created_time,type
        });

    }

    $scope.$on('fb.auth.authResponseChange', function() {
      $scope.status = $facebook.isConnected();

      if($scope.status) {
          $facebook.api('/me/accounts').then(function(response) {
              response.data.forEach(function(p){
                  $scope.pages.push(new Page(p));
              });

              console.log($scope.pages);
          });
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
