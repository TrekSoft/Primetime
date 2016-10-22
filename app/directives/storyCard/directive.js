app.directive('storyCard', function() {
    return {
        restrict: 'E',
        scope: {
            post: '='
        },
        templateUrl: 'directives/storyCard/template.html'
    };
});
