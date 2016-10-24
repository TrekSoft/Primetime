app.controller('StoryCardCtrl', ['$scope', function($scope) {
    const dateFormat = 'MM-DD-YYYY, h:mm:ss a';

    $scope.createdTime = moment($scope.post.created_time).format(dateFormat);
    $scope.scheduledTime = moment.unix($scope.post.scheduled_publish_time).format(dateFormat);
}
]);
