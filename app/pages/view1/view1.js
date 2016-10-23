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
    $scope.minScheduledDate = moment().startOf('day').toDate();
    $scope.maxScheduledDate = moment().add(6, 'months').toDate();
    $scope.hours = null;
    $scope.pstDiff = -7 - moment().utcOffset()/60;
    $scope.maxFansToday = {};
    $scope.newPost = null;

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

            $scope.newPost = {
                message: "",
                date: moment().startOf('day').toDate()
            };

            setHourOptions();
        });
    };

    $scope.post = function() {
        $scope.currentPage.publishPost($scope.newPost.message).then($scope.publishSuccess);
    };

    $scope.schedule = function() {
        let scheduleTime = moment($scope.newPost.date).add($scope.newPost.time.val, 'hours').unix();
        $scope.currentPage.publishPost($scope.newPost.message, scheduleTime).then($scope.publishSuccess);
    };

    $scope.publishSuccess = function(response) {
        $scope.newPost = {};
        $scope.currentPage.getPosts();
    };

    $scope.dateChanged = function() {
        setHourOptions();
    }

    function setHourOptions() {
        $scope.hours = [];
        $scope.newPost.time = null;
        let hour = 0;
        let maxFans = -1;

        if(moment($scope.newPost.date).isSame(moment().startOf('day'))) {
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

            let fans = fansOnlineAt(hour);
            let hourObject = {
                'val': hour,
                'display': display,
                'fansOnline': fans
            };

            if(fans > maxFans) {
                $scope.maxFansToday = hourObject;
                maxFans = fans;
            }

            $scope.hours.push(hourObject);

            hour++;
        }

        $scope.newPost.time = $scope.hours[0];
    };

    function fansOnlineAt(hour) {
        let timeDiff = $scope.pstDiff;

        if(hour == null || !$scope.currentPage.fanData) {
            return null;
        }
        else {
            let date = moment($scope.newPost.date).add(hour, 'hours').add(timeDiff, 'hours');
            return $scope.currentPage.fanData[date.day()][(hour + timeDiff).mod(24)];
        }
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

    // Fixes the Javascript negative number bug
    Number.prototype.mod = function(n) {
        return ((this%n)+n)%n;
    };
}]);


/*
$facebook.api('/418754271481410?fields=access_token').then(function(user) {
    $facebook.api('/418754271481410/insights/page_fans_online').then(function(user) {
        console.log(user);
    });
});
*/
