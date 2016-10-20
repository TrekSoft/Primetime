app.directive('storyCard', function() {
    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        templateUrl: 'templates/book-widget.html'
    }
})
