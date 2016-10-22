app.factory('User', ['$q', '$facebook', 'Page', function($q, $facebook, Page) {
    function User(data) {
        if (data) {
            this.setData(data);
        }
    };
    User.prototype = {
        setData: function(data) {
            angular.extend(this, data);
        },

        load: function() {
            let deferred = $q.defer();
            let self = this;

            $facebook.api('/me').then(
                function(response) {
                    self.setData(response);
                    deferred.resolve(response);
                }
            );

            return deferred.promise;
        },

        getPages: function() {
            let deferred = $q.defer();

            this.pages = [];
            let self = this;

            $facebook.api('/me/accounts').then(
                function(response) {
                    response.data.forEach(function(p){
                        self.pages.push(new Page(p));
                    });

                    deferred.resolve(self.pages);
                }
            );

            return deferred.promise;
        }
    };

    return User;
}]);
