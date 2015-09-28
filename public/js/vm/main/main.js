/**
 * Created by Ignat on 8/15/2015.
 */

(function() {
    'use strict';

    angular
        .module('aqvaApp')
        .controller('MainController', MainController);

    MainController.$inject = ['$http', '$scope'];

    function MainController($http, $scope){

        $scope.tabs = [
            {heading: 'Предзаказы', template: '/js/vm/newOrder/newOrder.html'},
            {heading: 'Туры', template: '/js/vm/tours/tours.html'}
        ];
    }
}());
