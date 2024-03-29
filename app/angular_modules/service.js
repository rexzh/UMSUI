(function(){
    'use strict';
    var svc = angular.module('http.service', []);

    svc.factory('ajaxInterceptor', function ($rootScope) {
        var interceptor = {
            request: function(config) {
                if(!config.url.match(/^(.)*.html/g)) {
                    $rootScope.$broadcast('ajaxStart');
                }
                return config;
            },

            response: function(response) {
                if(response.config.url.match(/^(.)*.json/g)) {
                    $rootScope.$broadcast("serviceSuccess", response);
                }
                //console.log("response", response);
                $rootScope.$broadcast('ajaxEnd');
                return response;
            },

            responseError: function(response) {
                if(response.status == 401) {
                    $rootScope.$broadcast('logout');
                } else {
                    $rootScope.$broadcast("serviceFailure", response);
                }
                //console.log("response", response);
                $rootScope.$broadcast('ajaxEnd');
                return response;
            }
        }

        return interceptor;
    });

    var base_url = '';
    function pathCombine(p1, p2) {
        var p1End = p1[p1.length-1];
        var p2Begin = p2[0];
        if(p1End == '/' && p2Begin != '/')
            return p1 + p2;
        if(p1End != '/' && p2Begin == '/')
            return p1 + p2;
        if(p1End != '/' && p2Begin != '/')
            return p1 + '/' + p2;
        return p1 + p2.substr(1);
    }

    svc.factory('rest', function($q, $http){
        function url(args) {
            var path = base_url;
            for(var i = 0; i < args.length; i++) {
                path = pathCombine(path, args[i]);
            }
            return path;
        };
        var rest = {
            init: function(base) {
                base_url = base;
            },

            endpoint: function() {
                var path = url(arguments);
                return {
                    get: function(map, page, rows, cfg) {
                        var q = '?nocache=' + new Date().getTime();
                        if(typeof(page) != 'undefined')
                            q += '&page=' + page + '&rows=' + (rows || 10);
                        for(var k in map) {
                            q += ('&' + k + '=' + map[k]);
                        }
                        path += q;

                        var deferred = $q.defer();
                        $http.get(path, cfg).then(function(resp){
                            deferred.resolve(resp.data);
                        }, function(err){
                            deferred.reject(err);
                        });
                        return deferred.promise;
                    },

                    post: function(arg, cfg) {
                        var deferred = $q.defer();
                        $http.post(path, arg, cfg).then(function(resp){
                            deferred.resolve(resp.data);
                        }, function(err){
                            deferred.reject(err);
                        });
                        return deferred.promise;
                    },

                    put: function(arg, cfg) {
                        var deferred = $q.defer();
                        $http.put(path, arg, cfg).then(function(resp){
                            deferred.resolve(resp.data);
                        }, function(err){
                            deferred.reject(err);
                        });
                        return deferred.promise;
                    },

                    delete: function(arg, cfg) {
                        var deferred = $q.defer();
                        $http.delete(path, arg, cfg).then(function(resp){
                            deferred.resolve(resp.data);
                        }, function(err){
                            deferred.reject(err);
                        });
                        return deferred.promise;
                    }
                }
            }
        };

        return rest;
    });
})();

(function(){
    'use strict';
    var common = angular.module('common', ['l10n']);

    common.filter('unixTime', function($L){
        return function(timestamp){
            return $L.formatDate(new Date(timestamp));
        }
    });

    common.filter('money', function($L){
        return function(amount) {
            return (amount / 100).toFixed(2);
        }
    });

    common.factory('dataShare', function () {
        var _data = {};
        return {
            getData: function(key) {
                return _data[key];
            },
            setData: function(key, val) {
                _data[key] = val;
            }
        }
    });

    common.factory('dataPass', function () {
        var _key = null;
        var _data = {};
        return {
            getData: function(key) {
                var result = _data;
                _data = {};
                if(_key == key)
                    return result;
                else
                    return null;
            },
            setData: function(key, val) {
                _key = key;
                _data = val;
            }
        }
    });
})();