/**
 * Created by Ignat on 8/15/2015.
 */

angular
    .module('aqvaApp', ['ngRoute', 'ui.bootstrap'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/main'});
    }]);
