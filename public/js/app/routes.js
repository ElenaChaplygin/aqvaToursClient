/**
 * Created by Ignat on 8/15/2015.
 */

(function() {
    'use strict';

    angular
        .module('aqvaApp')
        .config(config)

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/main', {
                templateUrl: '/js/vm/main/main.html',
                controller: 'MainController'/*,
                controllerAs: 'vm'*/
            })
        /*.when('/newTour', {
                templateUrl: '/js/vm/newTour/newTour.html',
                controller: 'NewTourController',
                controllerAs: 'vm'
            })*/
            /*.when('/header',{
                templateUrl: '/templates/header.html'
            })*/

    }
}());
