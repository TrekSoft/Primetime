app.factory('Page', ['$q', '$facebook', 'Post', function($q, $facebook, Post) {
    function Page(data) {
        if (data) {
            this.setData(data);
        }
    };

    Page.prototype = {
        setData: function(data) {
            angular.extend(this, data);
        },

        getFanData: function() {
            let deferred = $q.defer();

            if(!this.fanData) {
                let oneWeekAgo = moment().startOf('day').subtract(7, 'days').unix();
                let self = this;
                this.fanData = {};

                $facebook.api('/'+this.id+'/insights/page_fans_online?since='+oneWeekAgo).then(
                    function(response) {
                        response.data[0].values.forEach(
                            function(metric) {
                                let startDate = moment(metric.end_time).subtract(1, 'days');
                                self.fanData[startDate.unix()] = metric.value;
                            }
                        );

                        deferred.resolve(self.fanData);
                    }
                );
            }
            else {
                deferred.resolve(this.fanData);
            }

            return deferred.promise;
        },

        getPosts: function() {
            let deferred = $q.defer();

            this.posts = [];
            let self = this;

            $facebook.api('/'+this.id+'/posts?fields=object_id,message,is_published,created_time,type').then(
                function(response) {
                    response.data.forEach(
                        function(post){
                            let p = new Post(post);
                            p.getViews();
                            self.posts.push(p);
                        }
                    );

                    deferred.resolve(self.posts);
                }
            );

            return deferred.promise;
        }
    };

    return Page;
}]);
