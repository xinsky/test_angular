angular.module('currencyApp.services', []).factory('currencyService', function($http,$q) {
    return {
        getMusic: function (_genre) {
            var SCtoken = "a04856b0834fb8f0494cf6630f4c35be",
                genre = _genre;
                query = "https://api.soundcloud.com/tracks.json?genres=" + encodeURIComponent(genre) + "&client_id=" + SCtoken,
                responsePromise = {};
            var deferred = $q.defer();
            var promise = $http.get(query);
            promise.success(function(data, status, headers, config) { 
                deferred.resolve(data)
            });
            promise.error(function(data, status, headers, config) {
                deferred.resolve();
            });
            return deferred.promise;
        }
    }

});

