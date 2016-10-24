app.directive('storyCard', function() {
    return {
        restrict: 'E',
        scope: {
            post: '=',
            page: '='
        },
        templateUrl: 'directives/storyCard/template.html',
        controller: 'StoryCardCtrl'
    };
});
