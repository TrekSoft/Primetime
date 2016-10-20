app.factory('Post', ['$q', '$facebook', function($q, $facebook) {
    function Post(data) {
        if (data) {
            this.setData(data);
        }
    };
    Post.prototype = {
        setData: function(data) {
            angular.extend(this, data);
        }
    };
    return Post;
}]);
