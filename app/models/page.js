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

        getProfilePic: function() {
            let deferred = $q.defer();
            let self = this;

            $facebook.api('/'+this.id+'/picture').then(
                function(response) {
                    self.profilePic = response.data.url;
                    deferred.resolve(self.profilePic);
                }
            );

            return deferred.promise;
        },

        getFanData: function() {
            let deferred = $q.defer();

            if(!this.fanData) {
                let oneWeekAgo = moment().subtract(8, 'days').toString('YYYY-MM-DD');
                let yesterday = moment().subtract(1, 'days').toString('YYYY-MM-DD');
                let self = this;
                this.fanData = [];
                this.maxFansOnline = 0;

                $facebook.api('/'+this.id+'/insights/page_fans_online?since='+oneWeekAgo+'&until='+yesterday).then(
                    function(response) {
                        response.data[0].values.forEach(
                            function(metric) {
                                let startDate = moment(metric.end_time).subtract(1, 'days');

                                if(!metric.value) {
                                    delete self.fanData;
                                    delete self.maxFansOnline;
                                    return;
                                }

                                let fanDataArray = Object.keys(metric.value).map(key => Number(metric.value[key]));

                                self.fanData[startDate.day()] = fanDataArray;
                                self.maxFansOnline = Math.max(self.maxFansOnline, Math.max(...fanDataArray));
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

            $facebook.api(
                '/'+
                self.id+
                '/posts?fields=object_id,message,is_published,created_time,type'
            ).then(function(response) {
                addPosts(response);

                $facebook.api(
                    '/'+
                    self.id+
                    '/promotable_posts?is_published=false&fields=object_id,message,is_published,created_time,type,scheduled_publish_time'
                ).then(function(response) {
                    addPosts(response);
                    deferred.resolve(self.posts);
                });
            });

            function addPosts(response) {
                response.data.forEach(
                    function(post){
                        let p = new Post(post);
                        p.getViews();
                        self.posts.push(p);
                    }
                );
            }

            return deferred.promise;
        },

        publishPost: function(message, scheduleTime) {
            let post = {
                'access_token': this.access_token,
                'message': message
            };

            if(scheduleTime) {
                post.published = false;
                post.scheduled_publish_time = scheduleTime;
            }

            return $facebook.api('/'+this.id+'/feed', 'POST', post);
        }
    };

    return Page;
}]);
