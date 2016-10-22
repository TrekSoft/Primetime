app.factory('Post', ['$q', '$facebook', function($q, $facebook) {
    function Post(data) {
        if (data) {
            this.setData(data);
        }
    };

    Post.prototype = {
        setData: function(data) {
            angular.extend(this, data);
        },

        getViews: function() {
            let deferred = $q.defer();
            let self = this;

            $facebook.api('/'+this.id+'/insights/post_impressions_unique').then(
                function(response) {
                    self.views = response.data[0].values[0].value;
                    deferred.resolve(self.views);
                }
            );

            return deferred.promise;
        }
    };

    return Post;
}]);
