'use strict';

angular.module('primetimeApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'pages/view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$facebook', 'User', 'Page', function($scope, $facebook, User, Page) {
    $scope.status = null;
    $scope.user = null;
    $scope.pages = [];
    $scope.currentPage = null;
    $scope.posts = null;
    $scope.fanData = null;
    $scope.newPost = {};
    $scope.minScheduledDate = moment().toDate();
    $scope.maxScheduledDate = moment().add(6, 'months').toDate();
    $scope.hours = null;

    $scope.login = function() {
        $facebook.login();
    };

    $scope.selectPage = function(page) {
        $scope.currentPage = page;

        page.getPosts().then(function(response) {
            $scope.posts = response;
        });

        page.getFanData().then(function(response) {
            $scope.fanData = response;
        });
    };

    $scope.post = function() {
        $scope.currentPage.publishPost($scope.newPost.message).then($scope.publishSuccess);
    };

    $scope.schedule = function() {
        $scope.currentPage.publishPost($scope.newPost.message, moment($scope.newPost.date).unix()).then($scope.publishSuccess);
    };

    $scope.publishSuccess = function(response) {
        $scope.newPost = {};
        $scope.currentPage.getPosts();
    };

    $scope.setHourOptions = function() {
        $scope.hours = [];
        $scope.newPost.time = null;
        let hour = 0;

        if(moment($scope.newPost.date).day() == moment().day()) {
            // Add 11 minutes to the current time because Facebook scheduled posts
            // have to be at least 11 minutes in the future. Then get the next hour.
            hour = moment().add(11, 'minutes').add(1, 'hour').hour();
        }

        while(hour < 24) {
            let suffix = hour >= 12 ? 'PM' : 'AM';
            let display = ":00 " + suffix;

            if(hour > 12) {
                display = hour%12 + display;
            }
            else if(hour == 0) {
                display = 12 + display;
            }
            else {
                display = hour + display;
            }

            $scope.hours.push(
                {
                    'val': hour,
                    'display': display
                }
            );

            hour++;
        }
    };

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
